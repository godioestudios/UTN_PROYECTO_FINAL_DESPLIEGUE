import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { forgotPassword } from '../../services/authService'
import ServerMessage from '../../components/ServerMessage/ServerMessage'
import styles from '../../components/ResendEmailVerification/ResendEmailVerification.module.css'

function ForgotPasswordScreen() {

    const { formState, handleChangeInput } = useForm({ email: '' })
    const { loading, response, error, sendRequest } = useRequest()

    function handleSubmit(event) {
        event.preventDefault()
        sendRequest(() => forgotPassword(formState.email))
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <span className={styles.logo}>slack</span>
                <h1 className={styles.title}>Olvidé mi contraseña</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            className={styles.input}
                            name='email'
                            id='email'
                            type='email'
                            autoComplete='email'
                            value={formState.email}
                            onChange={handleChangeInput}
                        />
                    </div>

                    <ServerMessage
                        error={!loading && error}
                        success={!loading && response && response.message}
                    />

                    <button className={styles.submit} type='submit' disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar mail'}
                    </button>
                </form>

                <p className={styles.footer}>
                    <Link to='/login'>Volver a iniciar sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordScreen
