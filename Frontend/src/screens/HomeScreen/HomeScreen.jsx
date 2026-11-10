import WorkspaceList from '../../components/WorkspaceList/WorkspaceList'
import styles from './HomeScreen.module.css'

function getUserInitials() {
  try {
    const token = localStorage.getItem('auth_token')
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { name } = JSON.parse(atob(payload))
    return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  } catch {
    return '?'
  }
}

function HomeScreen() {

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Slack</span>
          <span className={styles.avatar}>{getUserInitials()}</span>
        </header>
        <nav className={styles.sidebarNav}>
          <h2 className={styles.sectionTitle}>Espacios de trabajo</h2>
          <WorkspaceList/>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <input className={styles.searchPill} type='search' placeholder='Buscar' aria-label='Buscar' />
        </header>
        <section className={styles.homeContent}>
          <h1>¡Bienvenido a Slack!</h1>
          <p>Elegí un espacio de trabajo de la barra lateral para empezar.</p>
        </section>
      </main>
    </div>
  )
}

export default HomeScreen
