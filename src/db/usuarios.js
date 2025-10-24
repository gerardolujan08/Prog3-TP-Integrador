import { conexion } from "./conexion.js";

export default class Usuarios {

    buscarTodos = async(user) => {
        let sql;
        if(user.tipo_usuario == 1) {
            sql = 'SELECT * FROM usuarios WHERE activo = 1';
        } else if(user.tipo_usuario == 2) {
            sql = 'SELECT * FROM usuarios WHERE activo = 1 AND tipo_usuario = 3';
        }
        const [usuarios] = await conexion.execute(sql);
        return usuarios;
    }

    buscarPorId = async(usuario_id) => {
        const sql = 'SELECT * FROM usuarios WHERE activo = 1 AND usuario_id = ?';
        const [usuario] = await conexion.execute(sql, [usuario_id]);
        return usuario[0];
    }

    buscarPorUsuario = async(nombre_usuario, contrasenia) => {
        const sql = `SELECT u.usuario_id, CONCAT(u.nombre,' ', u.apellido) as usuario, u.tipo_usuario
                     FROM usuarios AS u
                     WHERE u.nombre_usuario = ?
                        AND u.contrasenia = sha2(?, 256)
                        AND u.activo = 1;`
        const [result] = await conexion.query(sql, [nombre_usuario, contrasenia]);
        return result[0]
    }

    crear = async(usuario) => {
        const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular = null, foto = null } = usuario;
        
        const sql = `INSERT INTO usuarios 
                     (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) 
                     VALUES (?, ?, ?, sha2(?, 256), ?, ?, ?)`;
        
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