import express from 'express';
import { AuthControlador } from "../../controladores/authControlador.js";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { check } from "express-validator";

const router = express.Router();
const authControlador = new AuthControlador();

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
