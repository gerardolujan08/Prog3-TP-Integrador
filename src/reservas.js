import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js'
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'
import { router as v1TurnosRutas} from './v1/rutas/turnosRutas.js'
import { router as v1UsuariosRutas} from './v1/rutas/usuariosRutas.js'
import { router as v1ReservasRutas} from './v1/rutas/reservasRutas.js'
import { router as v1AuthRutas} from "./v1/rutas/authRutas.js";
import { router as v1EstadisticasRutas } from './v1/rutas/estadisticasRutas.js';
import { estrategia, validacion } from './config/passport.js';
import swaggerDocs from './config/swaggerConfig.js';

const app = express();
app.use(express.json());
passport.use(estrategia)
passport.use(validacion)
app.use(passport.initialize())

let log = fs.createWriteStream('./access.log', { flags: 'a' })
app.use(morgan('combined'))
app.use(morgan('combined', { stream: log }))

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/salones', passport.authenticate('jwt', {session: false}), v1SalonesRutas);
app.use('/api/v1/servicios', passport.authenticate('jwt', {session: false}), v1ServiciosRutas);
app.use('/api/v1/turnos', passport.authenticate('jwt', {session: false}), v1TurnosRutas);
app.use('/api/v1/usuarios', passport.authenticate('jwt', {session: false}), v1UsuariosRutas);
app.use('/api/v1/reservas', passport.authenticate('jwt', {session: false}), v1ReservasRutas);
app.use('/api/v1/auth', v1AuthRutas);
app.use('/api/v1/estadisticas', passport.authenticate('jwt', {session: false}), v1EstadisticasRutas);

export default app;