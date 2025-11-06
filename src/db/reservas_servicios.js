import { conexion } from "./conexion.js";

export default class ReservasServicios {
    
    crear = async(reserva_id, servicios) => {

        try{
            await conexion.beginTransaction();

            for (const servicio of servicios){
                const sql = `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) 
                    VALUES (?,?,?);`;
                await conexion.execute(sql, [reserva_id, servicio.servicio_id, servicio.importe ]);
            }

            await conexion.commit();

            return true;
        }catch(error){
            await conexion.rollback();
            console.log(`error en reservas_servicios.crear():`, error);
            return false;
        }
    }
}
