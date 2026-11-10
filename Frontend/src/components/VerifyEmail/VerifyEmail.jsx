import { Link } from 'react-router'
import ServerMessage from '../ServerMessage/ServerMessage'
import styles from './VerifyEmail.module.css'

export default function VerifyEmail({ token, loading, response, error }) {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <span className={styles.logo}>slack</span>
                <h1 className={styles.title}>Verificación de correo</h1>

                {!token && <ServerMessage error='Falta el token de verificación' />}
                {loading && <p className={styles.text}>Verificando tu cuenta...</p>}

                {token && (
                    <ServerMessage
                        error={!loading && error}
                        success={!loading && response && 'Cuenta verificada, redirigiendo al inicio de sesión...'}
                    />
                )}

                {!token && (
                    <p className={styles.footer}>
                        <Link to='/login'>Ir a iniciar sesión</Link>
                    </p>
                )}
            </div>
        </div>
    )
}
