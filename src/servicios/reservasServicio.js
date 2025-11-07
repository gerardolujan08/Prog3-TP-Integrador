import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import InformeServicio from "./informesServicio.js";
import NotificacionesServicio from "./notificacionesServicio.js"; 
import { conexion } from "../db/conexion.js";

export default class ReservasServicio {

    constructor(){
        this.reservas = new Reservas();
        this.reservas_servicios = new ReservasServicios();
        this.informes = new InformeServicio();
        this.notificaciones_servicios = new NotificacionesServicio(); 
    }

    buscarTodos = (usuario) => {
        if(usuario.tipo_usuario === 1 || usuario.tipo_usuario === 2){
            return this.reservas.buscarTodos();
        } else {
            return this.reservas.buscarPropias(usuario.usuario_id);
        }
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
            servicios
        } = reserva;

        const [[salon]] = await conexion.execute(
            "SELECT importe FROM salones WHERE salon_id = ?",
            [salon_id]
        );
        const importe_salon = parseFloat(salon.importe) || 0;

        let importe_servicios = 0;

        const serviciosCompletos = [];

        for (const s of servicios) {
            const [[servicioDB]] = await conexion.execute(
                "SELECT importe FROM servicios WHERE servicio_id = ?",
                [s.servicio_id]
            );
            const importe_servicio = parseFloat(servicioDB.importe) || 0;
            importe_servicios += importe_servicio;

            serviciosCompletos.push({
                servicio_id: s.servicio_id,
                importe: importe_servicio
            });
        }

        const importe_total = importe_salon + importe_servicios;

        const nuevaReserva = {
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero: foto_cumpleaniero || null, 
            tematica: tematica || null,
            importe_salon,
            importe_total
        };

        const result = await this.reservas.crear(nuevaReserva);

        if (!result) return null;

        await this.reservas_servicios.crear(result.reserva_id, serviciosCompletos);

        try {
            const datosParaNotificacion = await this.reservas.datosParaNotificacion(result.reserva_id);
            await this.notificaciones_servicios.enviarCorreo(datosParaNotificacion);
        } catch (notificationError) {
            console.log('Advertencia: No se pudo enviar el correo.');
        }

        return this.reservas.buscarPorId(result.reserva_id);
    }


    actualizar = async (reserva_id, reservaData) => {

        const reservaAntigua = await this.reservas.buscarPorId(reserva_id);
        if(!reservaAntigua){
            return false; 
        }

        const {
            fecha_reserva,
            salon_id,
            turno_id,
            foto_cumpleaniero,
            tematica,
            servicios
        } = reservaData;

        const [[salon]] = await conexion.execute(
            "SELECT importe FROM salones WHERE salon_id = ?",
            [salon_id]
        );
        const importe_salon = parseFloat(salon.importe) || 0;

        let importe_servicios = 0;
        const serviciosCompletos = [];

        for (const s of servicios) {
            const [[servicioDB]] = await conexion.execute(
                "SELECT importe FROM servicios WHERE servicio_id = ?",
                [s.servicio_id]
            );
            const importe_servicio = parseFloat(servicioDB.importe) || 0;
            importe_servicios += importe_servicio;
            serviciosCompletos.push({
                servicio_id: s.servicio_id,
                importe: importe_servicio
            });
        }

        const importe_total = importe_salon + importe_servicios;

        const datosActualizados = {
            fecha_reserva: fecha_reserva,
            salon_id: salon_id,
            usuario_id: reservaAntigua.usuario_id, 
            turno_id: turno_id,
            foto_cumpleaniero: foto_cumpleaniero || null,
            tematica: tematica || null,
            importe_salon: importe_salon,
            importe_total: importe_total,
        };

        try {
            await conexion.beginTransaction();

            const resultado = await this.reservas.actualizar(reserva_id, datosActualizados);

            if (resultado) {
                await this.reservas_servicios.actualizar(reserva_id, serviciosCompletos);
            }

            await conexion.commit();
            return (resultado !== null);
        } catch (error) {
            await conexion.rollback();
            console.log(`Error en reservasServicio.actualizar():`, error);
            return false;
        }
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
            const datosReporte = await this.reservas.buscarDatosReporte();
            const buffer = await this.informes.informeReservasPdf(datosReporte);
            return {
                buffer,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="reporte-reservas.pdf"'
                }
            };
        } else if (formato === 'csv') {
            const datosReporte = await this.reservas.buscarDatosReporte();
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

    actualizarFotoCumpleaniero = async (reserva_id, rutaFoto) => {
        const reservaExiste = await this.reservas.buscarPorId(reserva_id);
        if(!reservaExiste){
            return false;
        }

        const filasAfectadas = await this.reservas.actualizarFotoCumpleaniero(reserva_id, rutaFoto);
        
        return filasAfectadas > 0;
    }
}