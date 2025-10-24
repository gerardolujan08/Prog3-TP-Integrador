import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador{

    constructor(){
        this.turnosServicio = new TurnosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const turnos = await this.turnosServicio.buscarTodos();
            res.json({
                estado: true, 
                turnos: turnos
            });
    
        } catch (err) {
            console.log('Error en GET /turnos', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const turno_id = req.params.turno_id;
            const turno = await this.turnosServicio.buscarPorId(turno_id);

            if(!turno){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado.'
                });
            }

            res.json({
                estado: true,
                turno: turno
            });
        } catch (err) {
            console.log('Error en GET /turnos/:turno_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const turnoCreado = await this.turnosServicio.crear(req.body);
            res.status(201).json({
                estado: true,
                mensaje: 'Turno creado exitosamente.',
                turno: turnoCreado
            });

        } catch (err) {
            console.log('Error en POST /turnos', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    actualizar = async (req, res) => {
        try {
            const turno_id = req.params.turno_id;
            const { orden, hora_desde, hora_hasta } = req.body;
            if(!orden || !hora_desde || !hora_hasta){
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos (orden, hora_desde, hora_hasta).'
                });
            }
            const turnoActualizado = { orden, hora_desde, hora_hasta };
            const actualizado = await this.turnosServicio.actualizar(turno_id, turnoActualizado);
            
            if(!actualizado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Turno actualizado exitosamente.',
                turno: turnoActualizado
            });

        } catch (err) {
            console.log('Error en PUT /turnos/:turno_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminar = async (req, res) => {
        try {
            const turno_id = req.params.turno_id;
            const eliminado = await this.turnosServicio.eliminar(turno_id);
            if(!eliminado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Turno eliminado exitosamente.'
            });

        } catch (err) {
            console.log('Error en DELETE /turnos/:turno_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}