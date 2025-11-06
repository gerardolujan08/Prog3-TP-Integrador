import { conexion } from "./conexion.js";
export default class Reservas {

    buscarTodos = async() => {
        const sql = `
            SELECT
                r.reserva_id,
                r.fecha_reserva,
                s.titulo AS salon,
                CONCAT(DATE_FORMAT(t.hora_desde, '%H:%i'), ' - ', DATE_FORMAT(t.hora_hasta, '%H:%i')) AS turno,
                COUNT(rs.servicio_id) AS servicios
            FROM
                reservas r
            JOIN salones s ON r.salon_id = s.salon_id
            JOIN turnos t ON r.turno_id = t.turno_id
            LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
            WHERE
                r.activo = 1
            GROUP BY
                r.reserva_id, s.titulo, t.hora_desde, t.hora_hasta
            ORDER BY
                r.reserva_id ASC
        `;
        const [reservas] = await conexion.execute(sql);
        return reservas;
    }

    buscarPropias = async(usuario_id) => {
        const sql = `
            SELECT
                r.reserva_id,
                r.fecha_reserva,
                s.titulo AS salon,
                CONCAT(DATE_FORMAT(t.hora_desde, '%H:%i'), ' - ', DATE_FORMAT(t.hora_hasta, '%H:%i')) AS turno,
                COUNT(rs.servicio_id) AS servicios
            FROM
                reservas r
            JOIN salones s ON r.salon_id = s.salon_id
            JOIN turnos t ON r.turno_id = t.turno_id
            LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
            WHERE
                r.activo = 1 AND r.usuario_id = ?
            GROUP BY
                r.reserva_id, s.titulo, t.hora_desde, t.hora_hasta
            ORDER BY
                r.reserva_id ASC
        `;
        const [reservas] = await conexion.query(sql, [usuario_id])
        return reservas
    }

    buscarPorId = async(reserva_id) => {
        const sqlReserva = `
            SELECT
                r.*, 
                s.titulo AS salon_nombre,
                CONCAT(DATE_FORMAT(t.hora_desde, '%H:%i'), ' - ', DATE_FORMAT(t.hora_hasta, '%H:%i')) AS turno_nombre
            FROM
                reservas r
            JOIN salones s ON r.salon_id = s.salon_id
            JOIN turnos t ON r.turno_id = t.turno_id
            WHERE
                r.activo = 1 AND r.reserva_id = ?
        `;
        const [reservaRows] = await conexion.execute(sqlReserva, [reserva_id]);

        if(reservaRows.length === 0){
            return null;
        }

        const reserva = reservaRows[0];

        const sqlServicios = `
            SELECT
                s.servicio_id,
                s.descripcion, 
                rs.importe
            FROM
                reservas_servicios rs
            JOIN servicios s ON rs.servicio_id = s.servicio_id
            WHERE
                rs.reserva_id = ?
        `;
        
        const [servicios] = await conexion.execute(sqlServicios, [reserva_id]);

        reserva.servicios = servicios;

        return reserva;
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
                    fecha_reserva = ?, 
                    salon_id = ?, 
                    usuario_id = ?, 
                    turno_id = ?, 
                    importe_salon = ?, 
                    importe_total = ?, 
                    foto_cumpleaniero = ?, 
                    tematica = ?
                WHERE reserva_id = ?
            `;
                
            await conexion.execute(sqlReserva, [
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id,
                importe_salon,  
                importe_total,  
                foto_cumpleaniero, 
                tematica,
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

    buscarDatosReporte = async() => {
        const sql = `
            SELECT
                r.reserva_id,
                DATE_FORMAT(r.fecha_reserva, '%d/%m/%Y') AS fecha_reserva,
                s.titulo AS salon_titulo,
                CONCAT(DATE_FORMAT(t.hora_desde, '%H:%i'), ' - ', DATE_FORMAT(t.hora_hasta, '%H:%i')) AS turno_completo,
                u.nombre_usuario AS cliente_email,
                r.importe_total,
                GROUP_CONCAT(serv.descripcion SEPARATOR '; ') AS servicios_lista
            FROM
                reservas r
            JOIN salones s ON r.salon_id = s.salon_id
            JOIN turnos t ON r.turno_id = t.turno_id
            JOIN usuarios u ON r.usuario_id = u.usuario_id
            LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
            LEFT JOIN servicios serv ON rs.servicio_id = serv.servicio_id
            WHERE
                r.activo = 1
            GROUP BY
                r.reserva_id, s.titulo, t.hora_desde, t.hora_hasta, u.nombre_usuario, r.importe_total
            ORDER BY
                r.reserva_id ASC
        `;
        const [resultado] = await conexion.execute(sql);
        
        return resultado;
    }

    actualizarFotoCumpleaniero = async (reserva_id, rutaFoto) => {
        const sql = 'UPDATE reservas SET foto_cumpleaniero = ? WHERE reserva_id = ? AND activo = 1';
        
        const [resultado] = await conexion.execute(sql, [rutaFoto, reserva_id]);
        
        return resultado.affectedRows;
    }
}
