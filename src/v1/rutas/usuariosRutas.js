import express from 'express';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const usuariosControlador = new UsuariosControlador();
const router = express.Router();

router.get('/', autorizarUsuarios([1, 2]), (req, res) => usuariosControlador.buscarTodos(req, res));

router.get('/:usuario_id', autorizarUsuarios([1, 2]), (req, res) => usuariosControlador.buscarPorId(req, res));

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

router.delete('/:usuario_id', autorizarUsuarios([1]), (req, res) => usuariosControlador.eliminar(req, res));

export { router };
