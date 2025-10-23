import express from 'express';
import { router as v1SalonesRutas} from './v1/rutas/salonesRutas.js'
import { router as v1NotificacionesRutas} from './v1/rutas/notificacionesRutas.js'

const app = express();

app.use(express.json());
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/notificaciones', v1NotificacionesRutas);

export default app;