import SalonesServicio from "../servicios/salonesServicio.js";

export default class SalonesControlador{

    constructor(){
        this.salonesServicio = new SalonesServicio();
    }

    estado = (req, res) => {
        res.json({
            estado: true,
            mensaje: 'API funcionando correctamente'
        });
    }

    buscarTodos = async (req, res) => {
        try {
            const salones = await this.salonesServicio.buscarTodos();

            res.json({
                estado: true, 
                datos: salones
            });
    
        } catch (err) {
            console.log('Error en GET /salones', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const salon = await this.salonesServicio.buscarPorId(salon_id);

            if(!salon){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                });
            }

            res.json({
                estado: true,
                datos: salon
            });
        } catch (err) {
            console.log('Error en GET /salones/:salon_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const { titulo, direccion, capacidad, importe } = req.body;
            if(!titulo || !direccion || !capacidad || !importe){
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos.'
                });
            }
            const nuevoSalon = { titulo, direccion, capacidad, importe };
            const salonId = await this.salonesServicio.crear(nuevoSalon);

            res.status(201).json({
                estado: true,
                mensaje: 'Salón creado exitosamente.',
                salon_id: salonId
            });

        } catch (err) {
            console.log('Error en POST /salones', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    actualizar = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const { titulo, direccion, capacidad, importe } = req.body;
            if(!titulo || !direccion || !capacidad || !importe){
                return res.status(400).json({
                    estado: false,
                    mensaje: 'Faltan datos requeridos.'
                });
            }
            const salonActualizado = { titulo, direccion, capacidad, importe };
            const actualizado = await this.salonesServicio.actualizar(salon_id, salonActualizado);
            if(!actualizado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Salón actualizado exitosamente.'
            });

        } catch (err) {
            console.log('Error en PUT /salones/:salones_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminar = async (req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const eliminado = await this.salonesServicio.eliminar(salon_id);
            if(!eliminado){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no encontrado.'
                });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Salón eliminado exitosamente.'
            });

        } catch (err) {
            console.log('Error en DELETE /salones/:salon_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
}
