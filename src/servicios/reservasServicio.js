import Reservas from "../db/reservas.js";
import InformeServicio from "./informesServicio.js";

export default class ReservasServicio {

    constructor(){
        this.reservas = new Reservas();
        this.informes = new InformeServicio();
    }

    buscarTodos = (usuario) => {
        if(usuario.tipo_usuario < 3){
            return this.reservas.buscarTodos();
        } else return this.reservas.buscarPropias(usuario.usuario_id);
    }

    buscarPorId = (reserva_id) => {
        return this.reservas.buscarPorId(reserva_id);
    }

    crear = (reserva) => {
        return this.reservas.crear(reserva);
    }

    actualizar = async (reserva_id, reserva) => {
        const reservaExiste = await this.reservas.buscarPorId(reserva_id);
        if(!reservaExiste){
            return false;
        }
        await this.reservas.actualizar(reserva_id, reserva)
        return true;
    }

    eliminar = async (reserva_id) => {
        const reservaExiste = await this.reservas.buscarPorId(reserva_id);
        if(!reservaExiste){
            return false;
        }
        await this.reservas.eliminar(reserva_id)
        return true;
    }

    generarInforme = async (formato) => {
        if (formato === 'pdf') {
            const datosReporte = await this.reservas.buscarDatosReporteCsv();
            const buffer = await this.informes.informeReservasPdf(datosReporte);
            return {
                buffer,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="reporte-reservas.pdf"'
                }
            };
        } else if (formato === 'csv') {
            const datosReporte = await this.reservas.buscarDatosReporteCsv();
            const path = await this.informes.informeReservasCsv(datosReporte);
            return {
                path,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="reporte-reservas.csv"'
                }
            };
        }
    }
}