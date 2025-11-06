import { conexion } from "./conexion.js";

export default class Reservas {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1';
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }

    buscarPropias = async(usuario_id) => {
        const sql = 'SELECT * FROM reservas WHERE activo = 1 AND usuario_id = ?';
        const [reservas] = await conexion.query(sql, [usuario_id])
        return reservas
    }

    buscarPorId = async(reserva_id) => {
        const sqlReserva = 'SELECT * FROM reservas WHERE activo = 1 AND reserva_id = ?';
        const [reserva] = await conexion.execute(sqlReserva, [reserva_id]);

        if(reserva.length === 0){
            return null;
        }

        return reserva[0];
    }

    crear = async(reserva) => {
        const { 
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                importe_salon,
                importe_total 
            } = reserva;

        const sql = `INSERT INTO reservas 
            (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) 
            VALUES (?,?,?,?,?,?,?,?)`;

        const [result] = await conexion.execute(sql, [
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero,
            tematica,
            importe_salon,
            importe_total
        ]);

        if (result.affectedRows === 0){
            return null;
        }

        return this.buscarPorId(result.insertId);
    }

    actualizar = async(reserva_id, reserva) => {
        const { 
            fecha_reserva, 
            salon_id, 
            usuario_id, 
            turno_id,
            foto_cumpleaniero, 
            tematica,
            importe_salon,
            importe_total,
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

    datosParaNotificacion = async(reserva_id) => {
        const sql = `CALL obtenerDatosNotificacion(?)`;
        
        const [reserva] = await conexion.execute(sql, [reserva_id]);
        if(reserva.length === 0){
            return null;
        }
        
        return reserva;
    }

    buscarDatosReporteCsv = async() => {
        const sql = `
            SELECT 
                DATE_FORMAT(r.fecha_reserva, '%Y-%m-%d') as fecha_reserva,
                CONCAT('Reserva #', r.reserva_id) as titulo,
                r.reserva_id as orden
            FROM reservas r
            WHERE r.activo = 1
            ORDER BY r.fecha_reserva DESC`;
        
        const [result] = await conexion.query(sql);
        return result;
    }
}