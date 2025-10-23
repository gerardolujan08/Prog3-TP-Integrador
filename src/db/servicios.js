import { conexion } from "./conexion.js";

export default class Servicios {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios;
    }

    buscarPorId = async(servicio_id) => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1 AND servicio_id = ?';
        const [servicio] = await conexion.execute(sql, [servicio_id]);
        return servicio[0];
    }

    crear = async(servicio) => {
        const { descripcion, importe } = servicio;
        const sql = 'INSERT INTO servicios (descripcion, importe) VALUES (?, ?)';
        const [resultado] = await conexion.execute(sql, [descripcion, importe]);
        return this.buscarPorId(resultado.insertId);
    }

    actualizar = async(servicio_id, servicio) => {
        const { descripcion, importe } = servicio;
        const sql = 'UPDATE servicios SET descripcion = ?, importe = ? WHERE servicio_id = ?';
        await conexion.execute(sql, [descripcion, importe, servicio_id]);
        return this.buscarPorId(servicio_id);
    }

    eliminar = async(servicio_id) => {
        const sql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ?';
        await conexion.execute(sql, [servicio_id]);
        return { "mensaje": "eliminado correctamente" };
    }
    
}