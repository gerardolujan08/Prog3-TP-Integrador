import Estadisticas from "../db/estadisticas.js";

export default class EstadisticasServicio {

    constructor() {
        this.db = new Estadisticas();
    }

    obtenerEstadisticas = async () => {
        const estadisticas = await this.db.obtenerEstadisticas();
        if (!estadisticas) {
            return null;
        }
        return estadisticas;
    }
}