import { conexion } from "./conexion.js";

export default class ReservasServicios {
    
    crear = async(reserva_id, servicios) => {
        try {
            await conexion.beginTransaction();

            for (const servicio of servicios) {
                await conexion.execute(
                    `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?,?,?)`,
                    [reserva_id, servicio.servicio_id, servicio.importe]
                );
            }

            await conexion.commit();
            return true;
        } catch (error) {
            await conexion.rollback();
            console.log(`Error en reservas_servicios.crear():`, error);
            return false;
        }
    }

    actualizar = async(reserva_id, servicios) => {
        try {
            await conexion.execute(`DELETE FROM reservas_servicios WHERE reserva_id = ?`, [reserva_id]);

            for (const servicio of servicios) {
                await conexion.execute(
                    `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?,?,?)`,
                    [reserva_id, servicio.servicio_id, servicio.importe]
                );
            }

            return true;
        } catch (error) {
            console.log(`Error en reservas_servicios.actualizar():`, error);
            throw error;
        }
    }
}
