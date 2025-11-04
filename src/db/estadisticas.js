import { conexion } from "./conexion.js";

export default class Estadisticas {

    obtenerEstadisticas = async() => {
        const sql = 'CALL sp_informe_estadisticas()';
        const [resultado] = await conexion.execute(sql);
        
        if (resultado[0].length === 0) {
            return null;
        }

        return resultado[0][0];
    }
    
}