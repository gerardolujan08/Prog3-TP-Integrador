import passport from "passport";
import jwt from "jsonwebtoken";

export default class AuthServicio {
    login = async(req, res) => {
            passport.authenticate('local', {session: false}, (err, usuario, info) => {
                if(err || !usuario){
                    return res.status(400).json({
                        estado: false,
                        mensaje: 'Solicitud incorrecta.'
                    })
                }
    
                req.login(usuario, {session: false}, (err) => {
                    if(err){
                        res.send(err)
                    }
                    const token = jwt.sign(usuario, process.env.SECRET_JWT, { expiresIn: '1h' })
                    return res.json({
                        estado: true,
                        token
                    })
                })
            })(req, res)
        }
}