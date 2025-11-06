import { createObjectCsvWriter } from 'csv-writer';
import puppeteer, { Browser } from "puppeteer";
import handlebars from 'handlebars';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class InformeServicio {
    
    informeReservasCsv = async (datosReporte) => {
        try{
            let ruta = path.resolve(__dirname, '../utiles');
            ruta = path.join(ruta, 'reservas.csv'); 

            const csvWriter = createObjectCsvWriter({
                path: ruta,
                header: [
                    {id: 'reserva_id', title: 'ID Reserva'},
                    {id: 'fecha_reserva', title: 'Fecha Reserva'},
                    {id: 'salon_titulo', title: 'Salon'},
                    {id: 'turno_completo', title: 'Turno'},
                    {id: 'cliente_email', title: 'Cliente'},
                    {id: 'importe_total', title: 'Importe Total'},
                    {id: 'servicios_lista', title: 'Servicios'}
                ]
            });
            
            await csvWriter.writeRecords(datosReporte);
            return ruta;
            
        }catch (error){
            console.log(`Error generando csv ${error}`);
        }
    }

    informeReservasPdf = async (datosReporte) => {
        try{
            const plantillaPath  = path.join(__dirname, '../utiles/handlebars/informe.hbs');
            const plantillaHtml = fs.readFileSync(plantillaPath , 'utf8');
            
            const template = handlebars.compile(plantillaHtml);
            
            const fechaActual = new Date();
            const fechaFormateada = fechaActual.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const htmlFinal = template(
                {
                    reservas: datosReporte,
                    fechaGeneracion: fechaFormateada,
                    totalReservas: datosReporte.length
                }
            );
            
            let browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            let page = await browser.newPage();
            await page.setContent(htmlFinal);

            const buffer = await page.pdf({ 
                format: 'A4', 
                printBackground: true
            });

            await browser.close();

            return buffer;

        }catch(error){
            console.error('Error generando el PDF:', error);
            throw error;
        }
    }

}