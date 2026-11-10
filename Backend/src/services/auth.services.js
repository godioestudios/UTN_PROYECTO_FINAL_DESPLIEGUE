import ENVIRONMENT from "../config/environment.config.js"
import mailer_transporter from "../config/mailer.config.js"
import user_repository from "../repositories/user.repository.js"
import { compareHash, generateHash } from "../utils/bcrypt.util.js"
import verification_email_template from "../utils/email-templates/verification-email.template.js"
import reset_password_email_template from "../utils/email-templates/reset-password-email.template.js"
import ServerError from "../utils/error.util.js"
import jwt from 'jsonwebtoken'


/* 
Enviamos el mail de verificacion (se reutiliza en register y en resend)
*/
async function sendVerificationEmail(email) {
    const verify_email_token = jwt.sign(
        {
            email: email
        },
        ENVIRONMENT.JWT_SECRET_KEY,
        {
            expiresIn: '7d' // -> expira en 7 dias
        }
    )

    await mailer_transporter.sendMail(
        {
            to: email,
            from: ENVIRONMENT.GMAIL_USER,
            subject: "Verifica tu cuenta",
            html: verification_email_template(verify_email_token)
        }
    )
}


/* 
Registra el usuario: valida datos, verifica que el email no este usado, encripta la password, crea el usuario y envia el mail de verificacion
*/
async function register(username, email, password) {
    if (!username || !email || !password) {
        throw new ServerError(
            "Email, password and username is required",
            400
        )
    }

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        throw new ServerError(
            "Email is incorrect",
            400
        )
    }

    //Validar si el mail ya esta registrado
    const user_already_exist = await user_repository.getByEmail(email)
    if (user_already_exist) {
        throw new ServerError(
            'Email is already used',
            400
        )
    }

    /* 
    Encriptamos la password para que en DB se guarde un dato irreversible 
    Viendo el dato irreversible es IMPROBABLE que se sepa el dato original
    */
    const password_hash = await generateHash(password)

    await user_repository.create(username, email, password_hash)

    await sendVerificationEmail(email)
}


/* 
Inicia sesion: verifica el usuario, compara la contraseña contra el hash guardado en DB y crea el token de acceso
*/
async function login(email, password) {
    if (
        !email || !password || typeof email !== "string" || typeof password !== "string"
    ) {
        throw new ServerError(
            "Email and password are required",
            400
        );
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
        throw new ServerError(
            "Email is incorrect",
            400
        );
    }

    const user = await user_repository.getByEmail(email)

    if (!user) {
        throw new ServerError(
            "Invalid email or password",
            401
        );
    }

    //Compara el hash guardado en DB contra la contraseña que nos envió por body el cliente.
    const isPasswordValid = await compareHash(password, user.password); 
    if (!isPasswordValid) {
        throw new ServerError(
            "Invalid email or password",
            401
        );
    }


    if(!user.email_verificado){
        throw new ServerError(
            'Email no verificado',
            403
        )
    }


    /* Crear un token firmado de sesion */

    const auth_token = jwt.sign(
        {
            //Aca va a info que queres guardar en la credencial
            id: user._id,
            name: user.nombre,
            email: user.email
        },
        ENVIRONMENT.JWT_SECRET_KEY //Firmamos con esto
    )

    return auth_token
}


/* 
Verifica el token del link: valida firma/expiracion, busca el usuario, verifica que este activo y sin verificar, y lo marca como verificado
*/
async function verifyEmail(verify_email_token) {
    //Verificar el token
    const {email} = jwt.verify(
        verify_email_token,
        ENVIRONMENT.JWT_SECRET_KEY
    )

    const user_found = await user_repository.getByEmail(email)

    //Si no existe el usuario error
    if(!user_found){
        throw new ServerError('Usuario no encontrado', 404)
    }

    if(!user_found.activo){
        throw new ServerError('Usuario esta desactivado de la plataforma, contactate con soporte si consideras que esto es un error', 403)
    }

    //Si ya estas verificado deja de intentar verificarte
    if(user_found.email_verificado){
        throw new ServerError('Ya estas verificado', 400)
    }

    //Actualizamos al usuario para verificarlo
    await user_repository.updateById(
        user_found._id, 
        {
            email_verificado: true
        }
    )
}


/* 
Reenvia el mail de verificacion: si el usuario existe y falta verificar re-genera el token y reenvia el mail
En cualquier caso la respuesta es la misma para no revelar si la cuenta existe
*/
async function resendVerificationEmail(email) {
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        throw new ServerError('Email is incorrect', 400)
    }

    const user_found = await user_repository.getByEmail(email)

    //Si existe y falta verificar re-creamos el token y reenviamos el mail
    if(user_found && !user_found.email_verificado){
        await sendVerificationEmail(email)
    }

    return 'Se enviara un mail con los pasos para verificar en caso de que la cuenta sea real'
}


/* 
Enviamos el mail para restablecer la contraseña con un token de 1 hora
*/
async function sendPasswordResetEmail(email) {
    const reset_password_token = jwt.sign(
        {
            email: email,
            type: 'reset_password' // para que este token no se pueda usar en verify-email ni como credencial de sesion
        },
        ENVIRONMENT.JWT_SECRET_KEY,
        {
            expiresIn: '1h'
        }
    )

    await mailer_transporter.sendMail(
        {
            to: email,
            from: ENVIRONMENT.GMAIL_USER,
            subject: "Restablecer tu contraseña",
            html: reset_password_email_template(reset_password_token)
        }
    )
}


/* 
Solicita el restablecimiento: si el usuario existe le envia el mail con el token
En cualquier caso la respuesta es la misma para no revelar si la cuenta existe
*/
async function forgotPassword(email) {
    if (!email || typeof email !== 'string') {
        throw new ServerError('Email is required', 400)
    }

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        throw new ServerError('Email is incorrect', 400)
    }

    const user_found = await user_repository.getByEmail(email)

    if (user_found && user_found.activo) {
        await sendPasswordResetEmail(email)
    }

    return 'Se enviara un mail con los pasos para restablecer la contraseña en caso de que la cuenta sea real'
}


/* 
Restablece la contraseña: valida el token del link, busca el usuario y guarda la nueva password encriptada
*/
async function resetPassword(reset_password_token, password) {
    if (!reset_password_token || !password || typeof password !== 'string') {
        throw new ServerError('Token and password are required', 400)
    }

    //Verificar el token (firma y expiracion)
    const { email, type } = jwt.verify(
        reset_password_token,
        ENVIRONMENT.JWT_SECRET_KEY
    )

    if (type !== 'reset_password') {
        throw new ServerError('Token invalido', 400)
    }

    const user_found = await user_repository.getByEmail(email)

    if (!user_found) {
        throw new ServerError('Usuario no encontrado', 404)
    }

    if (!user_found.activo) {
        throw new ServerError('Usuario esta desactivado de la plataforma, contactate con soporte si consideras que esto es un error', 403)
    }

    const password_hash = await generateHash(password)

    await user_repository.updateById(
        user_found._id,
        {
            password: password_hash
        }
    )
}


export default {
    register,
    login,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
}
