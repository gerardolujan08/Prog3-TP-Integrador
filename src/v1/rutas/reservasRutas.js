import express from 'express';

import ReservasControlador from '../../controladores/reservasControlador.js';

const reservasControlador = new ReservasControlador();

const router = express.Router();

router.get('/', reservasControlador.buscarTodos);
router.get('/:reserva_id', reservasControlador.buscarPorId);
router.post('/', reservasControlador.crear);
router.put('/:reserva_id', reservasControlador.actualizar);
router.delete('/:reserva_id', reservasControlador.eliminar);

export { router };