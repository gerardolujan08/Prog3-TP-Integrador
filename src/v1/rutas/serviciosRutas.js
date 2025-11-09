import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';

const serviciosControlador = new ServiciosControlador();
const router = express.Router();

const cache = apicache.middleware;
const cache5Min = cache('5 minutes');

router.get('/', autorizarUsuarios([1, 2, 3]), cache5Min, (req, res) =>
  serviciosControlador.buscarTodos(req, res)
);
router.get('/:servicio_id', autorizarUsuarios([1, 2]), cache5Min, (req, res) =>
  serviciosControlador.buscarPorId(req, res)
);
router.post(
  '/',
  autorizarUsuarios([1, 2]),
  [
    check('descripcion', 'La descripción es necesaria.').notEmpty(),
    check('importe', 'El importe es necesario.').notEmpty(),
    check('importe', 'El importe debe ser numérico.').isNumeric(),
    validarCampos,
  ],
  async (req, res) => {
    await serviciosControlador.crear(req, res)
    apicache.clear()
  },
);
router.put(
  '/:servicio_id',
  autorizarUsuarios([1, 2]),
  [
    check('descripcion', 'La descripción es necesaria.').notEmpty(),
    check('importe', 'El importe es necesario.').notEmpty(),
    check('importe', 'El importe debe ser numérico.').isNumeric(),
    validarCampos,
  ],
  async (req, res) => {
    await serviciosControlador.actualizar(req, res)
    apicache.clear()
  }
);
router.delete('/:servicio_id', autorizarUsuarios([1, 2]), async (req, res) => {
  serviciosControlador.eliminar(req, res),
  apicache.clear()
}
);

export { router };
