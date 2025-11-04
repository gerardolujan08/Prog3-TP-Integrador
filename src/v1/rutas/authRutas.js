import express from 'express';
import { AuthControlador } from "../../controladores/authControlador.js";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { check } from "express-validator";

const router = express.Router();
const authControlador = new AuthControlador();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - nombre_usuario
 *         - contrasenia
 *       properties:
 *         nombre_usuario:
 *           type: string
 *           format: email
 *           description: Email del usuario para iniciar sesión.
 *           example: "mirko@admin.com"
 *         contrasenia:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario.
 *           example: "admin123"
 *   responses:
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         estado:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Inicio de sesión fallido"
 *     ValidationError:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           example: "Falla"
 *         mensaje:
 *           type: object
 *           description: Objeto que detalla los campos que fallaron la validación.
 */

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Endpoints para el inicio de sesión.
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión y obtener un token JWT
 *     description: Permite a un usuario autenticarse con su email (nombre_usuario) y contraseña para obtener un token de acceso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       '200':
 *         description: Autenticación exitosa. Devuelve el token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: Token JWT para ser usado en rutas protegidas.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3V..."
 *       '400':
 *         description: Error de validación (ej. campos faltantes, email inválido).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ValidationError'
 *       '401':
 *         description: Credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UnauthorizedError'
 */

router.post(
  '/login',
  [
    check('nombre_usuario', 'El correo electrónico es obligatorio').not().isEmpty(),
    check('nombre_usuario', 'El nombre de usuario debe ser un correo electrónico válido').isEmail(),
    check('contrasenia', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
  ],
  (req, res) => authControlador.login(req, res)
);

export { router };
