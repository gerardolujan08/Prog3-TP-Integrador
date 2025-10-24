import AuthServicio from "../servicios/authServicios.js";

export class AuthControlador {
    constructor(){
        this.servicio = new AuthServicio()
    }

    login = (req, res) => {
        return this.servicio.login(req, res)
    } 
}