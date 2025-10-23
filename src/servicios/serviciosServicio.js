import Servicios from "../db/servicios.js";


export default class ServiciosServicio {

    constructor(){
        this.servicios = new Servicios();
    }

    buscarTodos = () => {
        return this.servicios.buscarTodos();
    }

    buscarPorId = (servicio_id) => {
        return this.servicios.buscarPorId(servicio_id);
    }

    crear = (servicio) => {
        return this.servicios.crear(servicio);
    }

    actualizar = async (servicio_id, servicio) => {
        const servicioExiste = await this.servicios.buscarPorId(servicio_id);
        if(!servicioExiste){
            return false;
        }
        await this.servicios.actualizar(servicio_id, servicio)
        return true;
    }


    eliminar = async (servicio_id) => {
        const servicioExiste = await this.servicios.buscarPorId(servicio_id);
        if(!servicioExiste){
            return false;
        }
        await this.servicios.eliminar(servicio_id)
        return true;
    }
}