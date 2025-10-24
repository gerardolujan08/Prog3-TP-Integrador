import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const serviciosControlador = new ServiciosControlador();

const router = express.Router();

router.get('/', autorizarUsuarios([1,2,3]), serviciosControlador.buscarTodos);
router.get('/:servicio_id', autorizarUsuarios([1,2]), serviciosControlador.buscarPorId);
router.post('/',
    autorizarUsuarios([1,2]),
	[
        check('descripcion', 'La descripción es necesaria.').notEmpty(),
		check('importe', 'El importe es necesario.').notEmpty(),
		check('importe', 'El importe debe ser numérico.').isNumeric(),
		validarCampos
	],
	serviciosControlador.crear
);

router.put('/:servicio_id',
    autorizarUsuarios([1,2]),
	[
        check('descripcion', 'La descripción es necesaria.').notEmpty(),
		check('importe', 'El importe es necesario.').notEmpty(),
		check('importe', 'El importe debe ser numérico.').isNumeric(),
		validarCampos
	],
	serviciosControlador.actualizar
);
router.delete('/:servicio_id', autorizarUsuarios([1,2]), serviciosControlador.eliminar);

export { router };