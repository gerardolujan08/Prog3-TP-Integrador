import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';

const serviciosControlador = new ServiciosControlador();
const router = express.Router();

const cache = apicache.middleware;
const cache5Min = cache('5 minutes');

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         servicio_id:
 *           type: integer
 *           description: ID autogenerado del servicio.
 *           example: 1
 *         descripcion:
 *           type: string
 *           description: Descripción del servicio.
 *           example: "Catering Infantil"
 *         importe:
 *           type: string
 *           format: decimal
 *           description: Costo del servicio.
 *           example: "15000.00"
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
 *     ServicioInput:
 *       type: object
 *       required:
 *         - descripcion
 *         - importe
 *       properties:
 *         descripcion:
 *           type: string
 *           description: Descripción del servicio.
 *           example: "Show de Magia"
 *         importe:
 *           type: number
 *           format: decimal
 *           description: Costo del servicio.
 *           example: 20000.00
 *   responses:
 *     ServicioNotFoundError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Servicio no encontrado."
 */

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para la gestión de servicios adicionales.
 */

/**
 * @swagger
 * /api/v1/servicios:
 *   get:
 *     tags: [Servicios]
 *     summary: Listar todos los servicios activos (Cacheado por 5 min)
 *     description: Obtiene una lista de todos los servicios activos (activo=1). **Requiere rol Cliente, Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de servicios obtenida exitosamente.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 */
router.get('/', autorizarUsuarios([1, 2, 3]), cache5Min, (req, res) =>
  serviciosControlador.buscarTodos(req, res)
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   get:
 *     tags: [Servicios]
 *     summary: Buscar un servicio por ID (Cacheado por 5 min)
 *     description: Obtiene los detalles de un servicio específico por su ID. **Requiere rol Empleado o Admin.** La respuesta de esta ruta se almacena en caché por 5 minutos.
 *     security:
 *       - bearerAuth: []
 */
router.get('/:servicio_id', autorizarUsuarios([1, 2]), cache5Min, (req, res) =>
  serviciosControlador.buscarPorId(req, res)
);

/**
 * @swagger
 * /api/v1/servicios:
 *   post:
 *     tags: [Servicios]
 *     summary: Crear un nuevo servicio
 *     description: Añade un nuevo servicio a la base de datos. **Requiere rol Empleado o Admin.** (Esta ruta no se cachea y limpia el caché de servicios).
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  autorizarUsuarios([1, 2]),
  [
    check('descripcion', 'La descripción es necesaria.').notEmpty(),
    check('importe', 'El importe es necesario.').notEmpty(),
    check('importe', 'El importe debe ser numérico.').isNumeric(),
    validarCampos,
  ],
  (req, res) => serviciosControlador.crear(req, res)
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   put:
 *     tags: [Servicios]
 *     summary: Actualizar un servicio existente
 *     description: Actualiza los datos de un servicio por su ID. **Requiere rol Empleado o Admin.** (Esta ruta no se cachea y limpia el caché de servicios).
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:servicio_id',
  autorizarUsuarios([1, 2]),
  [
    check('descripcion', 'La descripción es necesaria.').notEmpty(),
    check('importe', 'El importe es necesario.').notEmpty(),
    check('importe', 'El importe debe ser numérico.').isNumeric(),
    validarCampos,
  ],
  (req, res) => serviciosControlador.actualizar(req, res)
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   delete:
 *     tags: [Servicios]
 *     summary: Eliminar un servicio (Soft Delete)
 *     description: Marca un servicio como inactivo (activo=0) en la base de datos. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:servicio_id', autorizarUsuarios([1, 2]), (req, res) =>
  serviciosControlador.eliminar(req, res)
);

export { router };
