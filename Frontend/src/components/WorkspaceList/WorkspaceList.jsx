import { Link } from 'react-router'
import useWorkspaceList from '../../hooks/useWorkspaceList.jsx'
import ServerMessage from '../ServerMessage/ServerMessage'
import styles from './WorkspaceList.module.css'

export default function WorkspaceList() {

    const {
        workspaces_error, 
        workspaces_loading, 
        workspaces_response, 
        reloadWorkspaces
    } = useWorkspaceList()



    if (workspaces_loading) {
        return <span className={styles.loading}>Cargando...</span>
    }
    else if (workspaces_error) {
        return <div className={styles.errorBlock}>
            <ServerMessage error={`Error: ${workspaces_error}`} />
            <button className={styles.retryButton} onClick={reloadWorkspaces}> Recargar </button>
        </div>
    }
    else if (!workspaces_response) {
        return <div className={styles.errorBlock}>
            <ServerMessage error='Ocurrio un problema al obtener la lista de espacios de trabajo' />
            <button className={styles.retryButton} onClick={reloadWorkspaces}> Recargar </button>
        </div>
    }
    else if (workspaces_response.data.workspaces.length === 0) {
        return <p className={styles.empty}>Aún no creaste ningún espacio de trabajo</p>
    }
    else {
        return <ul className={styles.list}>
            {workspaces_response.data.workspaces.map((workspace) => (
                <li key={workspace.workspace_id}>
                    <Link className={styles.item} to={`/workspace/${workspace.workspace_id}`}>
                        <span className={styles.avatar}>{workspace.workspace_nombre[0]?.toUpperCase()}</span>
                        <span className={styles.info}>
                            <span className={styles.name}>{workspace.workspace_nombre}</span>
                            <span className={styles.role}>{workspace.member_rol}</span>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    }
}
