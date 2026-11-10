import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import ServerMessage from '../../components/ServerMessage/ServerMessage'
import styles from './LoginScreen.module.css'

/* 
Siguiendo las practicas implementadas la conectar el formulario de login con nuesta API REST
Desarrollar la implementacion del formulario de registro y la consulta a la API REST
*/

function LoginScreen() {
    
    const initial_state = {email: '', password: ''}
    const {formState, handleChangeInput} = useForm(initial_state)
    const {loading, response, error, sendRequest} = useRequest()
    
    const navigate = useNavigate()
   

    async function handleSubmit (event){
        event.preventDefault()
        sendRequest(
            () => login(formState.email, formState.password)
        )
        console.log('Usuario intenta iniciar sesion', formState)
    }

    /* 
    Los efectos sirven para controlar la recarga/ejecucion de una funcion

    Cuando la response cambie/llegue:
        - Guardar en localstorage el auth_token (para que luego podamos seguir usandolo)
        - voy a redireccionar a /home
    */
    useEffect(
        () => {
            if(response && response.data){
                localStorage.setItem('auth_token', response.data.auth_token)
                navigate('/')
            }
        },
        [response]
    )

    
    
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <span className={styles.logo}>slack</span>
                <h1 className={styles.title}>Iniciar sesión</h1>

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
                    <div className={styles.field}>
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            className={styles.input}
                            name='password' 
                            id='password' 
                            type='password' 
                            autoComplete='current-password'
                            value={formState.password} 
                            onChange={handleChangeInput} 
                        />
                    </div>

                    <ServerMessage
                        error={!loading && error}
                        success={!loading && response && 'Inicio de sesion exitoso'}
                    />

                    <button className={styles.submit} type='submit' disabled={loading}>
                        {loading ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <p className={styles.footer}>
                    ¿No te llegó el mail de verificación? <Link to='/resend-email-verification'>Reenviar</Link>
                </p>

                <p className={styles.footer}>
                    ¿Olvidaste tu contraseña? <Link to='/forgot-password'>Recuperar acceso</Link>
                </p>

                <p className={styles.footer}>
                    ¿No tenés cuenta? <Link to='/register'>Registrate</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginScreen
