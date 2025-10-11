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

    crear = async (salon) => {
        const resultado = await this.salones.crear(salon);
        return resultado.insertId;
    }

    actualizar = async (salon_id, salon) => {
        const salonExistente = await this.salones.buscarPorId(salon_id);
        if(!salonExistente){
            return false;
        }
        await this.salones.actualizar(salon_id, salon);
        return true;
    }

    eliminar = async (salon_id) => {
        const salonExistente = await this.salones.buscarPorId(salon_id);
        if(!salonExistente){
            return false;
        }
        await this.salones.eliminar(salon_id);
        return true;
    }
}