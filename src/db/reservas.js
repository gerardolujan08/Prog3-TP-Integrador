import { conexion } from "./conexion.js";

export default class Reservas {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }

    buscarPorId = async(reserva_id) => {
        const sqlReserva = 'SELECT * FROM reservas WHERE activo = 1 AND reserva_id = ?';
        const [reserva] = await conexion.execute(sqlReserva, [reserva_id]);

        if (!reserva[0]) {
            return null;
        }

        const sqlServicios = `
            SELECT rs.servicio_id, s.descripcion, rs.importe 
            FROM reservas_servicios rs
            JOIN servicios s ON rs.servicio_id = s.servicio_id
            WHERE rs.reserva_id = ?`;
        const [servicios] = await conexion.execute(sqlServicios, [reserva_id]);

        return {
            ...reserva[0],
            servicios: servicios 
        };
    }

    crear = async(reserva) => {
        const { 
            fecha_reserva, salon_id, usuario_id, turno_id, 
            importe_total, importe_salon = null, foto_cumpleaniero = null, tematica = null,
            servicios
        } = reserva;

        await conexion.beginTransaction(); 

        try {
            const sqlReserva = `
                INSERT INTO reservas 
                (fecha_reserva, salon_id, usuario_id, turno_id, importe_total, importe_salon, foto_cumpleaniero, tematica) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            
            const [resultado] = await conexion.execute(sqlReserva, [
                fecha_reserva, salon_id, usuario_id, turno_id, 
                importe_total, importe_salon, foto_cumpleaniero, tematica
            ]);

            const reserva_id = resultado.insertId;

            const sqlServicios = 'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)';
            
            for (const servicio of servicios) {
                await conexion.execute(sqlServicios, [reserva_id, servicio.servicio_id, servicio.importe]);
            }

            await conexion.commit(); 
            
            return this.buscarPorId(reserva_id);

        } catch (error) {
            await conexion.rollback(); 
            console.error("Error en la transacción de crear reserva:", error);
            throw error;
        }
    }

    actualizar = async(reserva_id, reserva) => {
        const { 
            fecha_reserva, salon_id, usuario_id, turno_id, 
            importe_total, importe_salon = null, foto_cumpleaniero = null, tematica = null,
            servicios
        } = reserva;

        await conexion.beginTransaction();

        try {
            const sqlReserva = `
                UPDATE reservas SET 
                fecha_reserva = ?, salon_id = ?, usuario_id = ?, turno_id = ?, 
                importe_total = ?, importe_salon = ?, foto_cumpleaniero = ?, tematica = ?
                WHERE reserva_id = ?`;
                
            await conexion.execute(sqlReserva, [
                fecha_reserva, salon_id, usuario_id, turno_id, 
                importe_total, importe_salon, foto_cumpleaniero, tematica,
                reserva_id
            ]);

            const sqlDeleteServicios = 'DELETE FROM reservas_servicios WHERE reserva_id = ?';
            await conexion.execute(sqlDeleteServicios, [reserva_id]);

            const sqlInsertServicios = 'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)';
            for (const servicio of servicios) {
                await conexion.execute(sqlInsertServicios, [reserva_id, servicio.servicio_id, servicio.importe]);
            }

            await conexion.commit();
            
            return this.buscarPorId(reserva_id);

        } catch (error) {
            await conexion.rollback();
            console.error("Error en la transacción de actualizar reserva:", error);
            throw error;
        }
    }

    eliminar = async(reserva_id) => {
        const sql = 'UPDATE reservas SET activo = 0 WHERE reserva_id = ?';
        await conexion.execute(sql, [reserva_id]);
        return { "mensaje": "eliminado correctamente" };
    }
}