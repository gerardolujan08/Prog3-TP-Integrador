import Reservas from "../db/reservas.js";

export default class ReservasServicio {

    constructor(){
        this.reservas = new Reservas();
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
}