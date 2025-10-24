import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import {Strategy as LocalStrategy} from "passport-local";
import UsuariosServicio from "../servicios/usuariosServicio.js";

// Configuración de la estrategia de authenticación 
export const estrategia = new LocalStrategy(
    {
        usernameField: 'nombre_usuario',
        passwordField: 'contrasenia'
    },
    async (nombre_usuario, contrasenia, done) => {
        try {
            const usuarioServicios = new UsuariosServicio()
            const usuario = await usuarioServicios.buscarPorUsuario(nombre_usuario, contrasenia)
            if(!usuario){
                return done(null, false, {mensaje: 'Inicio de sesion fallido'})
            }
            return done(null, usuario, {mensaje: 'Inicio de sesion exitoso'})
        } catch (exc) {
            done(exc);
        }
    }
)

// Validación del token
export const validacion = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_JWT
    },
    async(payload, done) => {
        const usuarioServicios = new UsuariosServicio()
        const usuario = await usuarioServicios.buscarPorId(payload.usuario_id);
        if(!usuario){
            return done(null, false, { mensaje: 'Token incorrecto!'});
        }
        return done(null, usuario);
    }
)