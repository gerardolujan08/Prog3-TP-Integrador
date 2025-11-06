import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import InformeServicio from "./informesServicio.js";
import NotificacionesServicio from "./notificacionesServicio.js";

export default class ReservasServicio {

    constructor(){
        this.reservas = new Reservas();
        this.reservas_servicios = new ReservasServicios();
        this.informes = new InformeServicio();
        this.notificaciones_servicios = new NotificacionesServicio();
    }

    buscarTodos = (usuario) => {
        if(usuario.tipo_usuario < 3){
            return this.reservas.buscarTodos();
        } else return this.reservas.buscarPropias(usuario.usuario_id);
    }

    buscarPorId = (reserva_id) => {
        return this.reservas.buscarPorId(reserva_id);
    }

    crear = async (reserva) => {
        
        const {
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero, 
            tematica,
            importe_salon,
            importe_total,
            servicios } = reserva;

        const nuevaReserva = {
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero, 
            tematica,
            importe_salon,
            importe_total
        }    

        const result = await this.reserva.crear(nuevaReserva);

        if (!result) {
            return null;
        }

        await this.reservas_servicios.crear(result.reserva_id, servicios);     
        
        try {
            const datosParaNotificacion = await this.reserva.datosParaNotificacion(result.reserva_id);
        
            await this.notificacioes_servicios.enviarCorreo(datosParaNotificacion);
        } catch (notificationError) {            
            console.log('Advertencia: No se pudo enviar el correo.');
        }

        return this.reserva.buscarPorId(result.reserva_id);
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