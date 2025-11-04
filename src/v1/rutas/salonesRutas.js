import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import SalonesControlador from '../../controladores/salonesControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import apicache from 'apicache';

const salonesControlador = new SalonesControlador();
const router = express.Router();

const cache = apicache.middleware;
const cache5Min = cache('5 minutes');

/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       properties:
 *         salon_id:
 *           type: integer
 *           description: ID autogenerado del salón.
 *           example: 1
 *         titulo:
 *           type: string
 *           description: Nombre o título del salón.
 *           example: "Salón Imperial"
 *         direccion:
 *           type: string
 *           description: Dirección física del salón.
 *           example: "Av. Siempre Viva 742"
 *         latitud:
 *           type: number
 *           format: float
 *           description: Coordenada de latitud.
 *           example: -31.4135
 *         longitud:
 *           type: number
 *           format: float
 *           description: Coordenada de longitud.
 *           example: -64.181
 *         capacidad:
 *           type: integer
 *           description: Capacidad máxima de personas.
 *           example: 100
 *         importe:
 *           type: string
 *           format: decimal
 *           description: Costo del alquiler del salón.
 *           example: "50000.00"
 *         creado:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro.
 *           example: "2025-11-04T23:55:00.000Z"
 *         modificado:
 *           type: string
 *           format: date-time
 *           description: Fecha de última modificación.
 *           example: "2025-11-04T23:55:00.000Z"
 *         activo:
 *           type: integer
 *           description: Indica si el registro está activo (1) o no (0).
 *           example: 1
 *     SalonInput:
 *       type: object
 *       required:
 *         - titulo
 *         - direccion
 *         - capacidad
 *         - importe
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Salón Imperial"
 *         direccion:
 *           type: string
 *           example: "Av. Siempre Viva 742"
 *         latitud:
 *           type: number
 *           format: float
 *           example: -31.4135
 *         longitud:
 *           type: number
 *           format: float
 *           example: -64.181
 *         capacidad:
 *           type: integer
 *           example: 100
 *         importe:
 *           type: number
 *           format: decimal
 *           example: 50000.00
 *   responses:
 *     NotFoundError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Salón no encontrado."
 */

/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Endpoints para la gestión de salones.
 */

/**
 * @swagger
 * /api/v1/salones/estado:
 *   get:
 *     tags: [Salones]
 *     summary: Comprobar estado del endpoint de Salones
 *     description: Ruta de prueba para verificar que el controlador de salones está funcionando. No requiere autenticación.
 *     responses:
 *       '200':
 *         description: El servicio está funcionando.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Salones funcionando correctamente."
 */
router.get('/estado', (req, res) => salonesControlador.estado(req, res));

/**
 * @swagger
 * /api/v1/salones:
 *   get:
 *     tags: [Salones]
 *     summary: Listar todos los salones activos (Cacheado por 5 min)
 *     description: Obtiene una lista de todos los salones que están activos (activo=1). **Requiere rol Cliente, Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de salones obtenida exitosamente.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 */
router.get('/', autorizarUsuarios([1, 2, 3]), cache5Min, (req, res) => salonesControlador.buscarTodos(req, res));

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   get:
 *     tags: [Salones]
 *     summary: Buscar un salón por ID (Cacheado por 5 min)
 *     description: Obtiene los detalles de un salón específico por su ID. **Requiere rol Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []
 */
router.get('/:salon_id', autorizarUsuarios([1, 2]), cache5Min, (req, res) => salonesControlador.buscarPorId(req, res));

/**
 * @swagger
 * /api/v1/salones:
 *   post:
 *     tags: [Salones]
 *     summary: Crear un nuevo salón
 *     description: Añade un nuevo salón a la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  autorizarUsuarios([1, 2]),
  [
    check('titulo', 'El título es necesario.').notEmpty(),
    check('direccion', 'La dirección es necesaria.').notEmpty(),
    check('latitud')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (req.body.longitud === undefined || req.body.longitud === null) {
          throw new Error('La longitud es necesaria si se proporciona la latitud.');
        }
        return true;
      })
      .isFloat({ min: -90, max: 90 })
      .withMessage('La latitud debe ser un número entre -90 y 90.'),
    check('longitud')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (req.body.latitud === undefined || req.body.latitud === null) {
          throw new Error('La latitud es necesaria si se proporciona la longitud.');
        }
        return true;
      })
      .isFloat({ min: -180, max: 180 })
      .withMessage('La longitud debe ser un número entre -180 y 180.'),
    check('capacidad', 'La capacidad es necesaria.').notEmpty().isNumeric(),
    check('importe', 'El importe es necesario.').notEmpty().isNumeric(),
    validarCampos,
  ],
  (req, res) => salonesControlador.crear(req, res)
);

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   put:
 *     tags: [Salones]
 *     summary: Actualizar un salón existente
 *     description: Actualiza los datos de un salón específico por su ID. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 */
router.put('/:salon_id', autorizarUsuarios([1, 2]), (req, res) => salonesControlador.actualizar(req, res));

/**
 * @swagger
 * /api/v1/salones/{salon_id}:
 *   delete:
 *     tags: [Salones]
 *     summary: Eliminar un salón (Soft Delete)
 *     description: Marca un salón como inactivo (activo=0) en la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:salon_id', autorizarUsuarios([1, 2]), (req, res) => salonesControlador.eliminar(req, res));

export { router };
