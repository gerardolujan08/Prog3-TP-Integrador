import express from 'express';
import { AuthControlador } from "../../controladores/authControlador.js";
import { validarCampos } from "../../middlewares/validarCampos.js";
import { check } from "express-validator";

const router = express.Router()
const authControlador = new AuthControlador()

router.post('/login', [
    check('nombre_usuario', 'El correo electronico es obligatorio').not().isEmpty(),
    check('nombre_usuario', 'El nombre de usuario debe ser un correo electronico valido').isEmail(),
    check('contrasenia', 'La contrasenia es obligatoria').not().isEmpty(),
    validarCampos
],authControlador.login)

export { router }