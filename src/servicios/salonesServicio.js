import Salones from "../db/salones.js";


export default class SalonesServicio {

    constructor(){
        this.salones = new Salones();
    }

    buscarTodos = () => {
        return this.salones.buscarTodos();
    }

    buscarPorId = (salon_id) => {
        return this.salones.buscarPorId(salon_id);
    }

    crear = (salon) => {
        return this.salones.crear(salon);
    }

    actualizar = async (salon_id, salon) => {
        const salonExiste = await this.salones.buscarPorId(salon_id);
        if(!salonExiste){
            return false;
        }
        await this.salones.actualizar(salon_id, salon)
        return true;
    }


    eliminar = async (salon_id) => {
        const salonExiste = await this.salones.buscarPorId(salon_id);
        if(!salonExiste){
            return false;
        }
        await this.salones.eliminar(salon_id)
        return true;
    }
}