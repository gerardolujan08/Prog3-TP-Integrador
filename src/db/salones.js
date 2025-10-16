import { conexion } from "./conexion.js";

export default class Salones {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        const [salones] = await conexion.execute(sql);
        return salones;
    }

    buscarPorId = async(salon_id) => {
        const sql = 'SELECT * FROM salones WHERE activo = 1 AND salon_id = ?';
        const [salon] = await conexion.execute(sql, [salon_id]);
        return salon[0];
    }

    crear = async(salon) => {
        const { titulo, direccion, capacidad, importe } = salon;
        const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?, ?, ?, ?)';
        const [resultado] = await conexion.execute(sql, [titulo, direccion, capacidad, importe]);
        return this.buscarPorId(resultado.insertId);
    }

    actualizar = async(salon_id, salon) => {
        const { titulo, direccion, capacidad, importe } = salon;
        const sql = 'UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ? WHERE salon_id = ?';
        await conexion.execute(sql, [titulo, direccion, capacidad, importe, salon_id]);
        return this.buscarPorId(salon_id);
    }

    eliminar = async(salon_id) => {
        const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';
        await conexion.execute(sql, [salon_id]);
        return this.buscarPorId(salon_id);
    }
    
}