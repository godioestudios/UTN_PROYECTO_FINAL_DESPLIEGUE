/* 
El CSS del mail es inline porque Gmail y otros clientes hacen strip de <style>
*/

import ENVIRONMENT from "../../config/environment.config.js"

export default function verification_email_template(verify_email_token) {
    return `
        <body style='margin:0; padding:0; background-color:#f4f4f6;'>
            <table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f4f6; padding:32px 16px; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;'>
                <tr>
                    <td align='center'>
                        <table role='presentation' width='480' cellpadding='0' cellspacing='0' style='max-width:480px; width:100%; background-color:#ffffff; border-radius:16px;'>
                            <tr>
                                <td align='center' style='padding:32px 40px 0;'>
                                    <span style='font-size:28px; font-weight:800; letter-spacing:-1px; color:#481a54;'>slack</span>
                                </td>
                            </tr>
                            <tr>
                                <td align='center' style='padding:24px 40px 0;'>
                                    <h1 style='margin:0; font-size:20px; color:#181818;'>Bienvenido a nuestra plataforma</h1>
                                </td>
                            </tr>
                            <tr>
                                <td align='center' style='padding:12px 40px 0; font-size:15px; line-height:1.5; color:#616061;'>
                                    Necesitamos verificar este correo electronico para activar tu cuenta.
                                </td>
                            </tr>
                            <tr>
                                <td align='center' style='padding:28px 40px;'>
                                    <a href='${ENVIRONMENT.URL_FRONTEND}/verify-email?verification_token=${verify_email_token}' style='display:block; padding:14px 20px; background-color:#481a54; color:#ffffff; font-size:16px; font-weight:700; text-decoration:none; border-radius:8px;'>
                                        Verificar mi cuenta
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td align='center' style='padding:0 40px 32px; border-top:1px solid #dbd6de; padding-top:20px; font-size:13px; line-height:1.5; color:#616061;'>
                                    Si no creaste esta cuenta, podes ignorar este mensaje.<br/>
                                    Este link expira en 7 dias.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    `
}
