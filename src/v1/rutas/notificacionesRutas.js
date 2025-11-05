import express from 'express';
import NotificacionesControlador from '../../controladores/notificacionesControlador.js';

const router = express.Router();
const notificacionesControlador = new NotificacionesControlador();

router.post('/', (req, res) => notificacionesControlador.enviarCorreo(req, res));

export { router };
