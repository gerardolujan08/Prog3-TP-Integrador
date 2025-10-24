import ReservasServicio from "../servicios/reservasServicio.js";

export default class ReservasControlador{

    constructor(){
        this.reservasServicio = new ReservasServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const reservas = await this.reservasServicio.buscarTodos(req.user);
            if(reservas.length === 0){
                res.status(404).json({
                    estado: false, 
                    mensaje: 'No se encontraron reservas a su nombre'
                });
                return;
            }
            res.json({
                estado: true, 
                reservas: reservas
            });
    
        } catch (err) {
            console.log('Error en GET /reservas', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reserva = await this.reservasServicio.buscarPorId(reserva_id);

            if(!reserva){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }

            res.json({
                estado: true,
                reserva: reserva
            });
        } catch (err) {
            console.log('Error en GET /reservas/:reserva_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const reservaCreada = await this.reservasServicio.crear(req.body);
            res.status(201).json({
                estado: true,
                mensaje: 'Reserva creada exitosamente.',
                reserva: reservaCreada
            });
        } catch (err) {
            console.log('Error en POST /reservas', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    actualizar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            
            const { fecha_reserva, salon_id, usuario_id, turno_id, importe_total, servicios } = req.body;

            if(!fecha_reserva || !salon_id || !usuario_id || !turno_id || !importe_total || !servicios){ 
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos (fecha_reserva, salon_id, usuario_id, turno_id, importe_total, servicios).'
                });
            }
            
            const actualizado = await this.reservasServicio.actualizar(reserva_id, req.body);
            
            if(!actualizado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Reserva actualizada exitosamente.',
                reserva: await this.reservasServicio.buscarPorId(reserva_id)
            });

        } catch (err) {
            console.log('Error en PUT /reservas/:reserva_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const eliminado = await this.reservasServicio.eliminar(reserva_id);
            if(!eliminado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Reserva eliminada exitosamente.'
            });

        } catch (err) {
            console.log('Error en DELETE /reservas/:reserva_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}