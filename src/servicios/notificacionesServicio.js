import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

export default class NotificacionesServicio {

    enviarCorreo = async (datosCorreo) => {        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const plantillaPath = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
        const plantilla = fs.readFileSync(plantillaPath, 'utf-8');

        const template = handlebars.compile(plantilla);
        
        const datos = {
            fecha: datosCorreo[0].map(a => a.fecha),
            salon: datosCorreo[0].map(a => a.salon),
            turno: datosCorreo[0].map(a => a.turno),
        };

        const correoHtml = template(datos);
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USERCORREO,
                pass: process.env.USERPASS
            }
        });

        const correosAdmin = datosCorreo[1].map(a => a.correoAdmin);
        const destinatarios = correosAdmin.join(', ');
        const correoCliente = datosCorreo[0].map(a => a.correo_cliente);

        const mailOptions = {
            from: process.env.USERCORREO,
            to: destinatarios,
            cc: correoCliente,
            subject: "Nueva Reserva Confirmada",
            html: correoHtml
        };
        
        try{
            await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente');
            return true;
        } catch (error) {
            console.log(`Error enviando el correo`, error);
            return false;
        }
    }
}