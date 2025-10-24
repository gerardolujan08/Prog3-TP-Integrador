import Usuarios from "../db/usuarios.js";

export default class UsuariosServicio {

    constructor(){
        this.usuarios = new Usuarios();
    }

    buscarTodos = (user) => {
        return this.usuarios.buscarTodos(user);
    }

    buscarPorId = (usuario_id) => {
        return this.usuarios.buscarPorId(usuario_id);
    }

    buscarPorUsuario = (nombre_usuario, contrasenia) => {
        return this.usuarios.buscarPorUsuario(nombre_usuario, contrasenia);
    }

    crear = (usuario) => {
        return this.usuarios.crear(usuario);
    }

    actualizar = async (usuario_id, usuario) => {
        const usuarioExiste = await this.usuarios.buscarPorId(usuario_id);
        if(!usuarioExiste){
            return false;
        }
        
        // Aca también iría la lógica de HASH si la contraseña se está actualizando
        await this.usuarios.actualizar(usuario_id, usuario)
        return true;
    }


    eliminar = async (usuario_id) => {
        const usuarioExiste = await this.usuarios.buscarPorId(usuario_id);
        if(!usuarioExiste){
            return false;
        }
        await this.usuarios.eliminar(usuario_id)
        return true;
    }
}