import { Link } from 'react-router'
import ServerMessage from '../ServerMessage/ServerMessage'
import styles from './ResendEmailVerification.module.css'

export default function ResendEmailVerification({ formState, handleChangeInput, handleResend, loading, response, error }) {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <span className={styles.logo}>slack</span>
                <h1 className={styles.title}>Reenviar verificación</h1>

                <form className={styles.form} onSubmit={handleResend}>
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
                        {loading ? 'Enviando...' : 'Reenviar email'}
                    </button>
                </form>

                <p className={styles.footer}>
                    <Link to='/login'>Volver a iniciar sesión</Link>
                </p>
            </div>
        </div>
    )
}
