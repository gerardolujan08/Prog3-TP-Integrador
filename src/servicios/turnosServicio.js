import Turnos from "../db/turnos.js";


export default class TurnosServicio {

    constructor(){
        this.turnos = new Turnos();
    }

    buscarTodos = () => {
        return this.turnos.buscarTodos();
    }

    buscarPorId = (turno_id) => {
        return this.turnos.buscarPorId(turno_id);
    }

    crear = (turno) => {
        return this.turnos.crear(turno);
    }

    actualizar = async (turno_id, turno) => {
        const turnoExiste = await this.turnos.buscarPorId(turno_id);
        if(!turnoExiste){
            return false;
        }
        await this.turnos.actualizar(turno_id, turno)
        return true;
    }


    eliminar = async (turno_id) => {
        const turnoExiste = await this.turnos.buscarPorId(turno_id);
        if(!turnoExiste){
            return false;
        }
        await this.turnos.eliminar(turno_id)
        return true;
    }
}