import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js'
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'
import { router as v1TurnosRutas} from './v1/rutas/turnosRutas.js'
import { router as v1UsuariosRutas} from './v1/rutas/usuariosRutas.js'
import { router as v1ReservasRutas} from './v1/rutas/reservasRutas.js'
import { router as v1NotificacionesRutas} from './v1/rutas/notificacionesRutas.js'
import { router as v1AuthRutas} from "./v1/rutas/authRutas.js";
import { router as v1EstadisticasRutas } from './v1/rutas/estadisticasRutas.js';
import { estrategia, validacion } from './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API PROGIII - Gestión de Salones de Fiestas',
            version: '1.0.0',
            description: 'API REST para el Trabajo Final Integrador de Programación III. Sistema de gestión de reservas para salones de fiestas.'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el token JWT (sin "Bearer ") para autorizarte.'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [path.join(__dirname, 'v1/rutas/*.js')]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(express.json());
passport.use(estrategia)
passport.use(validacion)
app.use(passport.initialize())
app.use(morgan('combined'))

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/salones', passport.authenticate('jwt', {session: false}), v1SalonesRutas);
app.use('/api/v1/servicios', passport.authenticate('jwt', {session: false}), v1ServiciosRutas);
app.use('/api/v1/turnos', passport.authenticate('jwt', {session: false}), v1TurnosRutas);
app.use('/api/v1/usuarios', passport.authenticate('jwt', {session: false}), v1UsuariosRutas);
app.use('/api/v1/reservas', passport.authenticate('jwt', {session: false}), v1ReservasRutas);
app.use('/api/v1/notificaciones', passport.authenticate('jwt', {session: false}), v1NotificacionesRutas);
app.use('/api/v1/auth', v1AuthRutas);
app.use('/api/v1/estadisticas', passport.authenticate('jwt', {session: false}), v1EstadisticasRutas);

export default app;