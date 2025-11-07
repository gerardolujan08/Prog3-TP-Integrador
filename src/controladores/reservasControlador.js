import ReservasServicio from "../servicios/reservasServicio.js";
const formatosPermitidos = ['pdf', 'csv'];

export default class ReservasControlador{

    constructor(){
        this.reservasServicio = new ReservasServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const reservas = await this.reservasServicio.buscarTodos(req.user);
            if(reservas.length === 0){
                return res.status(404).json({
                    estado: false, 
                    mensaje: 'No se encontraron reservas a su nombre'
                });
            }
            res.json({ estado: true, reservas });
    
        } catch (err) {
            console.log('Error en GET /reservas', err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const reserva = await this.reservasServicio.buscarPorId(req.params.reserva_id);

            if(!reserva){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }

            res.json({ estado: true, reserva });

        } catch (err) {
            console.log('Error en GET /reservas/:reserva_id', err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    crear = async (req, res) => {
        try {
            const {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                servicios
            } = req.body;

            if(!fecha_reserva || !salon_id || !usuario_id || !turno_id || !servicios){
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos (fecha, salón, usuario, turno o servicios).'
                });
            }

            const nuevaReserva = await this.reservasServicio.crear({
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero,
                tematica,
                servicios
            });

            return res.json({
                estado: true, 
                mensaje: 'Reserva creada con éxito',
                reserva: nuevaReserva
            });
    
        } catch (err) {
            console.log('Error en POST /reservas/', err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    actualizar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const actualizado = await this.reservasServicio.actualizar(reserva_id, req.body);

            if(!actualizado){
                return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada.' });
            }

            res.status(200).json({
                estado: true,
                mensaje: 'Reserva actualizada exitosamente.',
                reserva: await this.reservasServicio.buscarPorId(reserva_id)
            });

        } catch (err) {
            console.log('Error en PUT /reservas/:reserva_id', err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const eliminado = await this.reservasServicio.eliminar(req.params.reserva_id);

            if(!eliminado){
                return res.status(404).json({ estado: false, mensaje: 'Reserva no encontrada.' });
            }

            res.status(200).json({ estado: true, mensaje: 'Reserva eliminada exitosamente.' });

        } catch (err) {
            console.log('Error en DELETE /reservas/:reserva_id', err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }

    informe = async (req, res) => {
        try {
            const formato = req.query.formato;

            if (!formatosPermitidos.includes(formato)) {
                return res.status(400).json({ estado: false, mensaje: "Formato inválido." });
            }

            const {buffer, path, headers} = await this.reservasServicio.generarInforme(formato);
            res.set(headers);

            if (formato === 'pdf') res.status(200).end(buffer);
            if (formato === 'csv') res.download(path);

        } catch (err) {
            console.log('Error en GET /reservas/informe', err);
            res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
        }
    }
}