import express from "express";
import EstadisticasControlador from "../../controladores/estadisticasControlador.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";

const router = express.Router();
const controlador = new EstadisticasControlador();

router.get('/', 
    autorizarUsuarios([1]), 
    controlador.obtenerEstadisticas
);

export { router };