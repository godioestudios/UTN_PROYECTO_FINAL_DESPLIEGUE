import styles from './ServerMessage.module.css'

export default function ServerMessage({ error, success }) {
    const message = error || success

    if (!message) {
        return null
    }

    return (
        <p
            role={error ? 'alert' : 'status'}
            className={`${styles.message} ${error ? styles.error : styles.success}`}
        >
            {message}
        </p>
    )
}
