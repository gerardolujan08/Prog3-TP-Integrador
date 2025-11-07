import express from 'express';
import TurnosControlador from '../../controladores/turnosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';

const turnosControlador = new TurnosControlador();
export const dateRegex = /^\d{2}:\d{2}(:\d{2})?$/;

const router = express.Router();

const cache = apicache.middleware;
const cache5Min = cache('5 minutes');

router.get('/', autorizarUsuarios([1, 2, 3]), cache5Min, (req, res) =>
  turnosControlador.buscarTodos(req, res)
);

router.get('/:turno_id', autorizarUsuarios([1, 2]), cache5Min, (req, res) =>
  turnosControlador.buscarPorId(req, res)
);

router.post(
  '/',
  autorizarUsuarios([1, 2]),
  [
    check('orden', 'El orden es necesario.').notEmpty(),
    check('orden', 'El orden debe ser un número entero entre 1 y 3.').isInt({
      min: 1,
      max: 3,
    }),
    check('hora_desde', 'La hora desde es necesaria.').notEmpty(),
    check('hora_desde', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(
      dateRegex
    ),
    check('hora_hasta', 'La hora hasta es necesaria.').notEmpty(),
    check('hora_hasta', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(
      dateRegex
    ),
    validarCampos,
  ],
  async (req, res) => { 
    await turnosControlador.crear(req, res)
    apicache.clear()
  }
);

router.put(
  '/:turno_id',
  autorizarUsuarios([1, 2]),
  [
    check('orden', 'El orden es necesario.').notEmpty(),
    check('orden', 'El orden debe ser un número entero entre 1 y 3.').isInt({
      min: 1,
      max: 3,
    }),
    check('hora_desde', 'La hora desde es necesaria.').notEmpty(),
    check('hora_desde', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(
      dateRegex
    ),
    check('hora_hasta', 'La hora hasta es necesaria.').notEmpty(),
    check('hora_hasta', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(
      dateRegex
    ),
    validarCampos,
  ],
  async (req, res) => {
    await turnosControlador.actualizar(req, res)
    apicache.clear()
  }
);

router.delete('/:turno_id', autorizarUsuarios([1, 2]), async (req, res) => {
  turnosControlador.eliminar(req, res)
  apicache.clear()
}
);

export { router };
