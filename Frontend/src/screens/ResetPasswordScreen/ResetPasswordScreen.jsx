import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPassword } from '../../services/authService'
import ServerMessage from '../../components/ServerMessage/ServerMessage'
import styles from '../../components/ResendEmailVerification/ResendEmailVerification.module.css'

function ResetPasswordScreen() {

    const [queryStringParams] = useSearchParams()
    const reset_password_token = queryStringParams.get('reset_token')

    const { formState, handleChangeInput } = useForm({ password: '', confirmPassword: '' })
    const { loading, response, error, sendRequest } = useRequest()
    const [passwordError, setPasswordError] = useState(null)

    function handleSubmit(event) {
        event.preventDefault()

        if (formState.password !== formState.confirmPassword) {
            setPasswordError('Las contraseñas no coinciden')
            return
        }

        setPasswordError(null)
        sendRequest(() => resetPassword(reset_password_token, formState.password))
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <span className={styles.logo}>slack</span>
                <h1 className={styles.title}>Restablecer contraseña</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="password">Nueva contraseña</label>
                        <input
                            className={styles.input}
                            name='password'
                            id='password'
                            type='password'
                            autoComplete='new-password'
                            value={formState.password}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            className={styles.input}
                            name='confirmPassword'
                            id='confirmPassword'
                            type='password'
                            autoComplete='new-password'
                            value={formState.confirmPassword}
                            onChange={handleChangeInput}
                        />
                    </div>

                    <ServerMessage
                        error={
                            !loading &&
                            (passwordError || error)
                        }
                        success={!loading && response && response.message}
                    />

                    <button className={styles.submit} type='submit' disabled={loading}>
                        {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                    </button>
                </form>

                <p className={styles.footer}>
                    <Link to='/login'>Volver a iniciar sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPasswordScreen
