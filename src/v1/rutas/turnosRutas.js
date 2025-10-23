import express from 'express';

import TurnosControlador from '../../controladores/turnosControlador.js';

const turnosControlador = new TurnosControlador();

const router = express.Router();

router.get('/', turnosControlador.buscarTodos);
router.get('/:turno_id', turnosControlador.buscarPorId);
router.post('/', turnosControlador.crear);
router.put('/:turno_id', turnosControlador.actualizar);
router.delete('/:turno_id', turnosControlador.eliminar);

export { router };