import UsuariosServicio from "../servicios/usuariosServicio.js";

export default class UsuariosControlador{

    constructor(){
        this.usuariosServicio = new UsuariosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const usuarios = await this.usuariosServicio.buscarTodos(req.user);
            res.json({
                estado: true, 
                usuarios: usuarios
            });
        } catch (err) {
            console.log('Error en GET /usuarios', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const usuario_id = req.params.usuario_id;
            const usuario = await this.usuariosServicio.buscarPorId(usuario_id);
            if(!usuario){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado.'
                });
            }
            res.json({
                estado: true,
                usuario: usuario
            });
        } catch (err) {
            console.log('Error en GET /usuarios/:usuario_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const usuarioCreado = await this.usuariosServicio.crear(req.body);
            res.status(201).json({
                estado: true,
                mensaje: 'Usuario creado exitosamente.',
                usuario: usuarioCreado
            });
        } catch (err) {
            console.log('Error en POST /usuarios', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    actualizar = async (req, res) => {
        try {
            const usuario_id = req.params.usuario_id;
            
            const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } = req.body;
            const { celular, foto } = req.body;
            if(!nombre || !apellido || !nombre_usuario || !contrasenia || !tipo_usuario){ 
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario).'
                });
            }
            
            const usuarioActualizado = { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto };
            const actualizado = await this.usuariosServicio.actualizar(usuario_id, usuarioActualizado);
            
            if(!actualizado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Usuario actualizado exitosamente.',
                usuario: usuarioActualizado
            });
        } catch (err) {
            console.log('Error en PUT /usuarios/:usuario_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminar = async (req, res) => {
        try {
            const usuario_id = req.params.usuario_id;
            const eliminado = await this.usuariosServicio.eliminar(usuario_id);
            if(!eliminado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Usuario eliminado exitosamente.'
            });
        } catch (err) {
            console.log('Error en DELETE /usuarios/:usuario_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}