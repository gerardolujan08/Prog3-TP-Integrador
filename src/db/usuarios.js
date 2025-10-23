import { conexion } from "./conexion.js";

export default class Usuarios {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM usuarios WHERE activo = 1';
        const [usuarios] = await conexion.execute(sql);
        return usuarios;
    }

    buscarPorId = async(usuario_id) => {
        const sql = 'SELECT * FROM usuarios WHERE activo = 1 AND usuario_id = ?';
        const [usuario] = await conexion.execute(sql, [usuario_id]);
        return usuario[0];
    }

    crear = async(usuario) => {
        const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular = null, foto = null } = usuario;
        
        const sql = `INSERT INTO usuarios 
                     (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        // Aca guardamos la contraseña en texto plano. Esto se debe cambiar por un hash.
        const [resultado] = await conexion.execute(sql, [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto]);
        
        return this.buscarPorId(resultado.insertId);
    }

    actualizar = async(usuario_id, usuario) => {
        const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular = null, foto = null } = usuario;
        
        const sql = `UPDATE usuarios SET 
                     nombre = ?, apellido = ?, nombre_usuario = ?, contrasenia = ?, 
                     tipo_usuario = ?, celular = ?, foto = ? 
                     WHERE usuario_id = ?`;

        await conexion.execute(sql, [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto, usuario_id]);
        
        return this.buscarPorId(usuario_id);
    }

    eliminar = async(usuario_id) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ?';
        await conexion.execute(sql, [usuario_id]);
        return { "mensaje": "eliminado correctamente" };
    }
    
}