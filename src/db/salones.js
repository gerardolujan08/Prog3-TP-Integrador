import { conexion } from "./conexion.js";

export default class Salones {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        const [salones] = await conexion.execute(sql);
        return salones;
    }

    buscarPorId = async(id) => {
        const sql = 'SELECT * FROM salones WHERE activo = 1 AND salon_id = ?';
        const [salon] = await conexion.execute(sql, [id]);
        return salon[0];
    }

    crear = async(salon) => {
        const { titulo, direccion, capacidad, importe } = salon;
        const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?, ?, ?, ?)';
        const [resultado] = await conexion.execute(sql, [titulo, direccion, capacidad, importe]);
        return resultado;
    }

    actualizar = async(id, salon) => {
        const { titulo, direccion, capacidad, importe } = salon;
        const sql = 'UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ? WHERE salon_id = ?';
        await conexion.execute(sql, [titulo, direccion, capacidad, importe, id]);
    }

    eliminar = async(id) => {
        const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?';
        await conexion.execute(sql, [id]);
    }
    
}