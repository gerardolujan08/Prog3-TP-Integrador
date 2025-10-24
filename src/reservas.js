import express from 'express';
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js'
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'
import { router as v1TurnosRutas} from './v1/rutas/turnosRutas.js'
import { router as v1UsuariosRutas} from './v1/rutas/usuariosRutas.js'
import { router as v1ReservasRutas} from './v1/rutas/reservasRutas.js'
import { router as v1NotificacionesRutas} from './v1/rutas/notificacionesRutas.js'
import {router as v1AuthRutas} from "./v1/rutas/authRutas.js";
import passport from 'passport';
import { estrategia, validacion } from './config/passport.js';
import morgan from 'morgan';

const app = express();
app.use(express.json());
passport.use(estrategia)
passport.use(validacion)
app.use(passport.initialize())
app.use(morgan('combined'))

app.use('/api/v1/salones', passport.authenticate('jwt', {session: false}), v1SalonesRutas);
app.use('/api/v1/servicios', passport.authenticate('jwt', {session: false}), v1ServiciosRutas);
app.use('/api/v1/turnos', passport.authenticate('jwt', {session: false}), v1TurnosRutas);
app.use('/api/v1/usuarios', passport.authenticate('jwt', {session: false}), v1UsuariosRutas);
app.use('/api/v1/reservas', passport.authenticate('jwt', {session: false}), v1ReservasRutas);
app.use('/api/v1/notificaciones', passport.authenticate('jwt', {session: false}), v1NotificacionesRutas);
app.use('/api/v1/auth', v1AuthRutas);

export default app;