import express from 'express';
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js'
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'
import { router as v1TurnosRutas} from './v1/rutas/turnosRutas.js'
import { router as v1UsuariosRutas} from './v1/rutas/usuariosRutas.js'
import { router as v1ReservasRutas} from './v1/rutas/reservasRutas.js'
import { router as v1NotificacionesRutas} from './v1/rutas/notificacionesRutas.js'

const app = express();

app.use(express.json());
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/servicios', v1ServiciosRutas);
app.use('/api/v1/turnos', v1TurnosRutas);
app.use('/api/v1/usuarios', v1UsuariosRutas);
app.use('/api/v1/reservas', v1ReservasRutas);
app.use('/api/v1/notificaciones', v1NotificacionesRutas);

export default app;