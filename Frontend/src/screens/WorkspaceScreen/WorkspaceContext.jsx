import { createContext, useContext, useEffect } from 'react'
import { Outlet, useParams } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { getAllMembersByWorkspaceId, getWorkspaceById } from '../../services/workspaceService'

const WorkspaceContext = createContext(null)

export function useWorkspaceContext(){
    return useContext(WorkspaceContext)
}

function WorkspaceContextProvider(){
    const { workspace_id } = useParams()
    const { response: workspace_response, error: workspace_error, loading: workspace_loading, sendRequest: sendWorkspaceRequest } = useRequest()
    const { response: members_response, error: members_error, loading: members_loading, sendRequest: sendMembersRequest } = useRequest()

    useEffect(
        () => {
            sendWorkspaceRequest(
                () => getWorkspaceById(workspace_id)
            )
            sendMembersRequest(
                () => getAllMembersByWorkspaceId(workspace_id)
            )
        },
        []
    )

    const context_value = {
        workspace_id,
        workspace_response,
        workspace_error,
        workspace_loading,
        members_response,
        members_error,
        members_loading
    }

    return (
        <WorkspaceContext.Provider value={context_value}>
            <Outlet/>
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceContextProvider
