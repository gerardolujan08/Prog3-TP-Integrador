import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();

const router = express.Router();

router.get('/estado', salonesControlador.estado);
router.get('/', salonesControlador.buscarTodos);
router.get('/:salon_id', salonesControlador.buscarPorId);
router.post('/', salonesControlador.crear);
router.put('/:salon_id', salonesControlador.actualizar);
router.delete('/:salon_id', salonesControlador.eliminar);

export { router };