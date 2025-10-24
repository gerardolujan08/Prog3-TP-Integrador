import express from 'express';

import TurnosControlador from '../../controladores/turnosControlador.js';
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
const turnosControlador = new TurnosControlador();

export const dateRegex = /^\d{2}:\d{2}(:\d{2})?$/;

const router = express.Router();

router.get('/', autorizarUsuarios([1,2,3]), turnosControlador.buscarTodos);
router.get('/:turno_id', autorizarUsuarios([1,2]), turnosControlador.buscarPorId);
router.post('/',
    autorizarUsuarios([1,2]),
	[
        check('orden', 'El orden es necesario.').notEmpty(),
		check('orden', 'El orden debe ser un número entero entre 1 y 3.').isInt({min: 1, max: 3}),
		check('hora_desde', 'La hora desde es necesaria.').notEmpty(),
		check('hora_desde', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(dateRegex),
		check('hora_hasta', 'La hora hasta es necesaria.').notEmpty(),
		check('hora_hasta', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(dateRegex),
		validarCampos
	],
	turnosControlador.crear
);

router.put('/:turno_id',
	autorizarUsuarios([1,2]),
	[
		check('orden', 'El orden es necesario.').notEmpty(),
		check('orden', 'El orden debe ser un número entero entre 1 y 3.').isInt({min: 1, max: 3}),
		check('hora_desde', 'La hora desde es necesaria.').notEmpty(),
		check('hora_desde', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(dateRegex),
		check('hora_hasta', 'La hora hasta es necesaria.').notEmpty(),
		check('hora_hasta', 'Formato de hora inválido (HH:MM o HH:MM:SS).').matches(dateRegex),
		validarCampos
	],
	turnosControlador.actualizar
);
router.delete('/:turno_id', autorizarUsuarios([1,2]), turnosControlador.eliminar);

export { router };