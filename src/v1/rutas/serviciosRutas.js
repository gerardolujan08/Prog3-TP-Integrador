import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';

const serviciosControlador = new ServiciosControlador();

const router = express.Router();

router.get('/', serviciosControlador.buscarTodos);
router.get('/:servicio_id', serviciosControlador.buscarPorId);
router.post('/', serviciosControlador.crear);
router.put('/:servicio_id', serviciosControlador.actualizar);
router.delete('/:servicio_id', serviciosControlador.eliminar);

export { router };