import express from 'express';
import ReservasControlador from '../../controladores/reservasControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import { dateRegex } from './turnosRutas.js'; 

import upload from '../../middlewares/uploadReserva.js';

const reservasControlador = new ReservasControlador();
const router = express.Router();

router.get('/', autorizarUsuarios([1, 2, 3]), (req, res) =>
  reservasControlador.buscarTodos(req, res)
);

router.get('/informe', autorizarUsuarios([1]), (req, res) =>
  reservasControlador.informe(req, res)
);

router.get('/:reserva_id', autorizarUsuarios([1, 2, 3]), (req, res) =>
  reservasControlador.buscarPorId(req, res)
);

router.post(
  '/',
  autorizarUsuarios([1, 3]), 
  [
    check('fecha_reserva', 'La fecha de la reserva es obligatoria').not().isEmpty(),
    check('salon_id', 'El ID del salon es obligatorio').not().isEmpty(),
    check('usuario_id', 'El ID del usuario es obligatorio').not().isEmpty(),
    check('turno_id', 'El ID del turno es obligatorio').not().isEmpty(),
    check('servicios', 'Los servicios son obligatorios').isArray({ min: 1 }),
    check('servicios.*.servicio_id', 'El servicio_id es obligatorio y debe ser un número').isInt({
      min: 0,
    }),
    validarCampos,
  ],
  (req, res) => reservasControlador.crear(req, res)
);


router.put(
  '/:reserva_id',
  autorizarUsuarios([1]),
  [
    
    check('salon_id', 'El ID del salon es obligatorio').not().isEmpty(),
    check('turno_id', 'El ID del turno es obligatorio').not().isEmpty(),
    
    check('servicios', 'El listado de servicios es obligatorio').isArray(), 
    
    check('servicios.*.servicio_id', 'El servicio_id es obligatorio y debe ser un número').isInt({
      min: 0,
    }),
    validarCampos,
  ],
  (req, res) => reservasControlador.actualizar(req, res)
);

router.delete('/:reserva_id', autorizarUsuarios([1]), (req, res) =>
  reservasControlador.eliminar(req, res)
);

router.post(
  '/:reserva_id/foto_cumpleaniero',
  [
    autorizarUsuarios([1, 2]),
    upload.single('foto_cumpleaniero')
  ],
  (req, res) => reservasControlador.subirFotoCumpleaniero(req, res)
);

export { router };