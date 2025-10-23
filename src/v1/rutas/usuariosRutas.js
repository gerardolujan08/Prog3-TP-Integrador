import express from 'express';

import UsuariosControlador from '../../controladores/usuariosControlador.js';

const usuariosControlador = new UsuariosControlador();

const router = express.Router();


router.get('/', usuariosControlador.buscarTodos);
router.get('/:usuario_id', usuariosControlador.buscarPorId);
router.post('/', usuariosControlador.crear);
router.put('/:usuario_id', usuariosControlador.actualizar);
router.delete('/:usuario_id', usuariosControlador.eliminar);

export { router };