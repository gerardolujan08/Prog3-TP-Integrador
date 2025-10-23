import NotificacionesServicio from '../servicios/notificacionesServicio.js';

export default class NotificacionesControlador {

    constructor() {
        this.notificacionesServicio = new NotificacionesServicio();
    }

    enviarCorreo = async (req, res) => {
        const { fecha, salon, turno, correoDestino } = req.body;

        if (!fecha || !salon || !turno || !correoDestino) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Faltan datos requeridos.'
            });
        }

        try {
            const datosCorreo = {
                fecha,
                salon,
                turno
            };

            const info = await this.notificacionesServicio.enviarCorreo(correoDestino, datosCorreo);

            res.status(200).json({
                estado: true,
                mensaje: 'Correo enviado exitosamente.',
                info: info.messageId
            });

        } catch (error) {
            console.error('Error al enviar correo:', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error al enviar correo.'
            });
        }
    }
}
