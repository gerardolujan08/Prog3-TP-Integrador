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
            const {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                importe_salon,
                importe_total,
                servicios } = req.body;

            const reserva = {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                importe_salon,
                importe_total, 
                servicios
            };

            const nuevaReserva = await this.reservasServicio.crear(reserva)

            if (!nuevaReserva) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no creada'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Reserva creada con exito',
                salon: nuevaReserva
            });
    
        } catch (err) {
            console.log('Error en POST /reservas/', err);
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

    informe = async (req, res) => {
        try {
            const formato = req.query.formato;
            const formatosPermitidos = ['pdf', 'csv'];

            if (!formato || !formatosPermitidos.includes(formato)) {
                return res.status(400).send({
                    estado: "falla",
                    mensaje: "Formato inválido para el informe."
                });
            }

            const {buffer, path, headers} = await this.reservasServicio.generarInforme(formato);

            res.set(headers);

            if (formato === 'pdf') {
                res.status(200).end(buffer);
            } else if (formato === 'csv') {
                res.status(200).download(path, (err) => {
                    if (err) {
                        console.error('Error al descargar el archivo CSV:', err);
                        res.status(500).json({
                            estado: false,
                            mensaje: 'Error al descargar el archivo.'
                        });
                    }
                });
            }

        } catch (err) {
            console.log('Error en GET /reservas/informe', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    subirFotoCumpleaniero = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'No se subió ningún archivo o el formato no es válido.'
                });
            }

            const reserva_id = req.params.reserva_id;
            const rutaFoto = req.file.path;

            const actualizado = await this.reservasServicio.actualizarFotoCumpleaniero(reserva_id, rutaFoto);

            if (!actualizado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no encontrada.'
                });
            }

            res.status(200).json({
                estado: true,
                mensaje: 'Foto de cumpleañero actualizada exitosamente.',
                ruta: rutaFoto
            });

        } catch (err) {
            console.log('Error en POST /reservas/:reserva_id/foto_cumpleaniero', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}