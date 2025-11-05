import express from 'express';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const usuariosControlador = new UsuariosControlador();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *           description: ID autogenerado del usuario.
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del usuario.
 *           example: "Mirko"
 *         apellido:
 *           type: string
 *           description: Apellido del usuario.
 *           example: "Admin"
 *         nombre_usuario:
 *           type: string
 *           format: email
 *           description: Nombre de usuario (usado como email para login).
 *           example: "mirko@admin.com"
 *         tipo_usuario:
 *           type: integer
 *           description: ID del rol del usuario (1=Admin, 2=Empleado, 3=Cliente).
 *           example: 1
 *         celular:
 *           type: string
 *           description: Número de celular (opcional).
 *           example: "3431234567"
 *         foto:
 *           type: string
 *           description: URL a una foto de perfil (opcional).
 *           example: "https://ejemplo.com/foto.png"
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
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - nombre_usuario
 *         - contrasenia
 *         - tipo_usuario
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Cliente"
 *         nombre_usuario:
 *           type: string
 *           format: email
 *           example: "juan@cliente.com"
 *         contrasenia:
 *           type: string
 *           format: password
 *           example: "cliente123"
 *         tipo_usuario:
 *           type: integer
 *           description: Rol (1=Admin, 2=Empleado, 3=Cliente).
 *           example: 3
 *         celular:
 *           type: string
 *           example: "3437654321"
 *         foto:
 *           type: string
 *           example: "https://ejemplo.com/foto_juan.png"
 *   responses:
 *     UsuarioNotFoundError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Usuario no encontrado."
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios (Admin y Empleados).
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar todos los usuarios activos
 *     description: |
 *       Obtiene una lista de usuarios activos.
 *       - **Si es Admin (rol 1):** Devuelve todos los usuarios (Admins, Empleados, Clientes).
 *       - **Si es Empleado (rol 2):** Devuelve solo usuarios Clientes (rol 3).
 *       **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 */
router.get('/', autorizarUsuarios([1, 2]), (req, res) => usuariosControlador.buscarTodos(req, res));

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Buscar un usuario por ID
 *     description: Obtiene los detalles de un usuario específico por su ID. **Requiere rol Empleado o Admin.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a buscar.
 *     responses:
 *       '200':
 *         description: Datos del usuario obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UsuarioNotFoundError'
 */
router.get('/:usuario_id', autorizarUsuarios([1, 2]), (req, res) => usuariosControlador.buscarPorId(req, res));

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crear un nuevo usuario
 *     description: Añade un nuevo usuario (Admin, Empleado o Cliente) a la base de datos. **Requiere rol Admin.**
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente.
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
 *                   example: "Usuario creado exitosamente."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Error de validación (campos faltantes o inválidos).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ValidationError'
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 */
router.post(
  '/',
  autorizarUsuarios([1]),
  [
    check('nombre', 'El nombre es obligatorio.').notEmpty(),
    check('apellido', 'El apellido es obligatorio.').notEmpty(),
    check('nombre_usuario', 'El nombre de usuario es obligatorio.').notEmpty(),
    check('nombre_usuario', 'Debe ser un correo electrónico válido.').isEmail(),
    check('contrasenia', 'La contraseña es obligatoria.').notEmpty(),
    check('tipo_usuario', 'El tipo de usuario es obligatorio.').notEmpty(),
    check('tipo_usuario', 'El tipo de usuario debe ser un número entre 1 y 3.').isInt({ min: 1, max: 3 }),
    check('celular').optional({ nullable: true }).isNumeric(),
    check('foto').optional({ nullable: true }).isString().withMessage('La foto debe ser texto.'),
    validarCampos
  ],
  (req, res) => usuariosControlador.crear(req, res)
);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar un usuario existente
 *     description: Actualiza los datos de un usuario específico por su ID. **Requiere rol Admin.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
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
 *                   example: "Usuario actualizado exitosamente."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Error de validación (campos inválidos).
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UsuarioNotFoundError'
 */
router.put(
  '/:usuario_id',
  autorizarUsuarios([1]),
  [
    check('nombre', 'El nombre es obligatorio.').notEmpty(),
    check('apellido', 'El apellido es obligatorio.').notEmpty(),
    check('nombre_usuario', 'El nombre de usuario es obligatorio.').notEmpty(),
    check('nombre_usuario', 'Debe ser un correo electrónico válido.').isEmail(),
    check('contrasenia', 'La contraseña es obligatoria.').notEmpty(),
    check('tipo_usuario', 'El tipo de usuario es obligatorio.').notEmpty(),
    check('tipo_usuario', 'El tipo de usuario debe ser un número entre 1 y 3.').isInt({ min: 1, max: 3 }),
    check('celular').optional({ nullable: true }).isString().withMessage('El celular debe ser texto.'),
    check('foto').optional({ nullable: true }).isString().withMessage('La foto debe ser texto.'),
    validarCampos
  ],
  (req, res) => usuariosControlador.actualizar(req, res)
);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario (Soft Delete)
 *     description: Marca un usuario como inactivo (activo=0) en la base de datos. **Requiere rol Admin.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar.
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *       '401':
 *         description: Error de autenticación.
 *       '403':
 *         description: Error de autorización.
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UsuarioNotFoundError'
 */
router.delete('/:usuario_id', autorizarUsuarios([1]), (req, res) => usuariosControlador.eliminar(req, res));

export { router };
