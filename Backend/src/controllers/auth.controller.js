import auth_services from "../services/auth.services.js"

/* 
Los controllers se encargan solo del protocolo HTTP (leer request / armar response)
La logica de negocio vive en ../services/auth.services.js
*/

export async function register(request, response) {
    console.log("[REGISTER]", request.body)

    const { username, email, password } = request.body

    await auth_services.register(username, email, password)

    return response.status(201).send({
        ok: true,
        status: 201,
        message: "User registered successfully"
    })
}


export async function login(request, response) {
    const { email, password } = request.body

    const auth_token = await auth_services.login(email, password)

    return response.status(200).send({
        ok: true,
        message: "You have logged in successfully",
        status: 200,
        data: {
            auth_token
        }
    })
}


export async function verifyEmail(request, response) {
    const { verify_email_token } = request.params

    await auth_services.verifyEmail(verify_email_token)

    return response.status(200).send(
        {
            ok: true, 
            status: 200,
            message: 'Usuario verificado exitosamente'
        }
    )
}


export async function resendVerificationEmail(request, response) {
    const { email } = request.params

    const message = await auth_services.resendVerificationEmail(email)

    return response.status(200).send(
        {
            ok: true,
            status: 200,
            message: message
        }
    )
}


export async function forgotPassword(request, response) {
    const { email } = request.body

    const message = await auth_services.forgotPassword(email)

    return response.status(200).send(
        {
            ok: true,
            status: 200,
            message: message
        }
    )
}


export async function resetPassword(request, response) {
    const { reset_password_token, password } = request.body

    await auth_services.resetPassword(reset_password_token, password)

    return response.status(200).send(
        {
            ok: true,
            status: 200,
            message: 'Contraseña restablecida exitosamente'
        }
    )
}
