import { conexion } from "./conexion.js";

export default class Turnos {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1';
        const [turnos] = await conexion.execute(sql);
        return turnos;
    }

    buscarPorId = async(turno_id) => {
        const sql = 'SELECT * FROM turnos WHERE activo = 1 AND turno_id = ?';
        const [turno] = await conexion.execute(sql, [turno_id]);
        return turno[0];
    }

    crear = async(turno) => {
        const { orden, hora_desde, hora_hasta } = turno;
        const sql = 'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?, ?, ?)';
        const [resultado] = await conexion.execute(sql, [orden, hora_desde, hora_hasta]);
        return this.buscarPorId(resultado.insertId);
    }

    actualizar = async(turno_id, turno) => {
        const { orden, hora_desde, hora_hasta } = turno;
        const sql = 'UPDATE turnos SET orden = ?, hora_desde = ?, hora_hasta = ? WHERE turno_id = ?';
        await conexion.execute(sql, [orden, hora_desde, hora_hasta, turno_id]);
        return this.buscarPorId(turno_id);
    }

    eliminar = async(turno_id) => {
        const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ?';
        await conexion.execute(sql, [turno_id]);
        return { "mensaje": "eliminado correctamente" };
    }
    
}