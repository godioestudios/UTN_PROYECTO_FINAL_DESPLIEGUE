import WorkspaceList from '../../components/WorkspaceList/WorkspaceList'

function HomeScreen() {

  

  return (
    <div>
      <h1>Bienvenido a slack!</h1>
      <div>
        <h2>Mis espacios de trabajo:</h2>
        <WorkspaceList/>
      </div>
    </div>
  )
}

export default HomeScreen