import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();

const router = express.Router();

router.get('/estado', salonesControlador.estado);
router.get('/', salonesControlador.buscarTodos);
router.get('/:salon_id', salonesControlador.buscarPorId);
router.post('/',
    [
        check('titulo', 'El título es necesario.').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad es necesaria.').notEmpty(),
        check('importe', 'El importe es necesario.').notEmpty(), 
        validarCampos    
    ],
    salonesControlador.crear);
router.put('/:salon_id', salonesControlador.actualizar);
router.delete('/:salon_id', salonesControlador.eliminar);

export { router };