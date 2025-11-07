import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import SalonesControlador from '../../controladores/salonesControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import apicache from 'apicache';

const salonesControlador = new SalonesControlador();
const router = express.Router();

const cache = apicache.middleware;
const cache5Min = cache('5 minutes');

router.get('/estado', (req, res) => salonesControlador.estado(req, res));
router.get('/', autorizarUsuarios([1, 2, 3]), cache5Min, (req, res) => salonesControlador.buscarTodos(req, res));
router.get('/:salon_id', autorizarUsuarios([1, 2]), cache5Min, (req, res) => salonesControlador.buscarPorId(req, res));

router.post(
  '/',
  autorizarUsuarios([1, 2]),
  [
    check('titulo', 'El título es necesario.').notEmpty(),
    check('direccion', 'La dirección es necesaria.').notEmpty(),
    check('latitud')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (req.body.longitud === undefined || req.body.longitud === null) {
          throw new Error('La longitud es necesaria si se proporciona la latitud.');
        }
        return true;
      })
      .isFloat({ min: -90, max: 90 })
      .withMessage('La latitud debe ser un número entre -90 y 90.'),
    check('longitud')
      .optional({ nullable: true })
      .custom((value, { req }) => {
        if (req.body.latitud === undefined || req.body.latitud === null) {
          throw new Error('La latitud es necesaria si se proporciona la longitud.');
        }
        return true;
      })
      .isFloat({ min: -180, max: 180 })
      .withMessage('La longitud debe ser un número entre -180 y 180.'),
    check('capacidad', 'La capacidad es necesaria.').notEmpty().isNumeric(),
    check('importe', 'El importe es necesario.').notEmpty().isNumeric(),
    validarCampos,
  ],
  async (req, res) => {
    await salonesControlador.crear(req, res);
    apicache.clear();
  }
);

router.put(
  '/:salon_id', 
  autorizarUsuarios([1, 2]), 
  async (req, res) => {
    await salonesControlador.actualizar(req, res);
    apicache.clear();
  }
);

router.delete(
  '/:salon_id', 
  autorizarUsuarios([1, 2]), 
  async (req, res) => {
    await salonesControlador.eliminar(req, res);
    apicache.clear();
  }
);
  
export { router };