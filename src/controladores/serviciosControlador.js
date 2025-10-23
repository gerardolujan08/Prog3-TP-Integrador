import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador{

    constructor(){
        this.serviciosServicio = new ServiciosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const servicios = await this.serviciosServicio.buscarTodos();

            res.json({
                estado: true, 
                servicios: servicios
            });
    
        } catch (err) {
            console.log('Error en GET /servicios', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id; 
            const servicio = await this.serviciosServicio.buscarPorId(servicio_id);

            if(!servicio){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Servicio no encontrado.' 
                });
            }

            res.json({
                estado: true,
                servicio: servicio 
            });
        } catch (err) {
            console.log('Error en GET /servicios/:servicio_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const { descripcion, importe } = req.body;
            if(!descripcion || !importe){ 
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos (descripcion, importe).'
                });
            }
            const nuevoServicio = { descripcion, importe }; 
            const servicioCreado = await this.serviciosServicio.crear(nuevoServicio);

            res.status(201).json({
                estado: true,
                mensaje: 'Servicio creado exitosamente.', 
                servicio: servicioCreado 
            });

        } catch (err) {
            console.log('Error en POST /servicios', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    actualizar = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id; 
            const { descripcion, importe } = req.body;
            if(!descripcion || !importe){ 
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos (descripcion, importe).'
                });
            }
            const servicioActualizado = { descripcion, importe };
            const actualizado = await this.serviciosServicio.actualizar(servicio_id, servicioActualizado);
            
            if(!actualizado){
                return res.status(4404).json({
                    estado: false,
                    mensaje: 'Servicio no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Servicio actualizado exitosamente.',
                servicio: servicioActualizado
            });

        } catch (err) {
            console.log('Error en PUT /servicios/:servicio_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminar = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id;
            const eliminado = await this.serviciosServicio.eliminar(servicio_id);
            if(!eliminado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Servicio no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Servicio eliminado exitosamente.'
            });

        } catch (err) {
            console.log('Error en DELETE /servicios/:servicio_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}