import express from 'express';
import NotificacionesControlador from '../../controladores/notificacionesControlador.js';

const notificacionesControlador = new NotificacionesControlador();

const router = express.Router();

router.post('/', notificacionesControlador.enviarCorreo);

export { router };