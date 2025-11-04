import EstadisticasServicio from "../servicios/estadisticasServicio.js";

export default class EstadisticasControlador {

    constructor() {
        this.servicio = new EstadisticasServicio();
    }

    obtenerEstadisticas = async (req, res) => {
        try {
            const estadisticas = await this.servicio.obtenerEstadisticas();
            
            if(!estadisticas){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'No se encontraron estadísticas.'
                });
            }

            res.json({
                estado: true, 
                estadisticas: estadisticas
            });
    
        } catch (err) {
            console.log('Error en GET /estadisticas', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}