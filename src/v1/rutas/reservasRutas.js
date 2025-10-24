import express from 'express';

import ReservasControlador from '../../controladores/reservasControlador.js';
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import { check } from "express-validator";
import { validarCampos } from '../../middlewares/validarCampos.js';
import { dateRegex } from './turnosRutas.js';

const reservasControlador = new ReservasControlador();

const router = express.Router();

router.get('/', autorizarUsuarios([1,2,3]),reservasControlador.buscarTodos);
router.get('/:reserva_id', autorizarUsuarios([1,2,3]),reservasControlador.buscarPorId);
router.post('/', 
    autorizarUsuarios([1,3]),
    [
        check('fecha_reserva', 'La fecha de la reserva es obligatoria').not().isEmpty(),
        check('salon_id', 'El ID del salon es obligatorio').not().isEmpty(),
        check('usuario_id', 'El ID del usuario es obligatorio').not().isEmpty(),
        check('turno_id', 'El ID del turno es obligatorio').not().isEmpty(),
        check('servicios', 'Los servicios son obligatorios').isArray({ min: 1 }),
        check('servicios.*.servicio_id', 'El servicio_id es obligatorio y debe ser un número')
            .isInt({ min: 0 }),
        validarCampos
    ], 
    reservasControlador.crear
);
router.put('/:reserva_id', 
    autorizarUsuarios([1]), 
    [
        check('fecha_reserva', 'La fecha de la reserva es obligatoria').optional().matches(dateRegex),
        check('salon_id', 'El ID del salon es obligatorio').not().isEmpty(),
        check('usuario_id', 'El ID del usuario es obligatorio').not().isEmpty(),
        check('turno_id', 'El ID del turno es obligatorio').not().isEmpty(),
        check('servicios', 'Los servicios son obligatorios').isArray({ min: 1 }),
        check('servicios.*.servicio_id', 'El servicio_id es obligatorio y debe ser un número')
            .isInt({ min: 0 }),
        validarCampos
    ], 
    reservasControlador.actualizar
);
router.delete('/:reserva_id', autorizarUsuarios([1]), reservasControlador.eliminar);

export { router };