import nodemailer from 'nodemailer';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

export default class NotificacionesServicio {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_CORREO,
                pass: process.env.PASS_CORREO
            },
            // Descomentar si es necesario probar con certificados no seguros, o deshabilitar antivirus
            // tls: {
            //     rejectUnauthorized: false
            // }
        });

        this.cargarPlantilla();
    }

    cargarPlantilla = async () => {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
            
            const plantilla = await readFile(plantillaPath, 'utf-8');
            this.template = handlebars.compile(plantilla);
            console.log('Plantilla de correo cargada correctamente.');
        } catch (error) {
            console.error('Error al cargar la plantilla de correo:', error);
        }
    }

    enviarCorreo = async (correoDestino, datos) => {
        if (!this.template) {
            throw new Error('La plantilla de correo no está disponible.');
        }

        const correoHtml = this.template(datos);
        
        const mailOptions = {
            to: correoDestino,
            subject: "Nueva Reserva Confirmada",
            html: correoHtml
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Correo enviado: ', info.messageId);
            return info;
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw new Error('Error al enviar el correo');
        }
    }
}
