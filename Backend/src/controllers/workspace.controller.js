import workspace_service from "../services/workspace.services.js"


export async function getAllWorkspaces(request, response) {
    const workspaces_obtenidos = await workspace_service.getAllWorkspacesByUserId(request.user.id)
    return response.status(200).send({
        ok: true,
        message: "Obtenidos todos los datos",
        status: 200,
        data: {
            workspaces: workspaces_obtenidos
        }
    })
}

export async function createWorkspace(request, response) {
    const { name, description } = request.body
    const { workspace_created, owner_membership } = await workspace_service.createWorkspace(
        request.user.id,
        name,
        description
    )

    return response.status(201).send({
        ok: true,
        status: 201,
        message: "Por ahora todo bien",
        data: {
            workspace_created,
            owner_membership
        }
    })
}

export async function getWorkspaceById(request, response) {
    return response.status(200).send({
        ok: true,
        message: "Workspace obtenido correctamente",
        status: 200,
        data: {
            workspace_selected: request.workspace
        }
    })
}

export async function deleteWorkspace(request, response) {
    await workspace_service.deleteWorkspace(request.workspace._id)
    return response.status(200).send({
        ok: true,
        message: "Workspace eliminado correctamente",
        status: 200,
        data: {
            workspace_deleted: request.workspace
        }
    })
}

export async function updateWorkspace(request, response) {
    const { workspace_id } = request.params
    const { name, description } = request.body

    const workspace_updated = await workspace_service.updateWorkspace(
        workspace_id,
        name,
        description
    )
    return response.status(200).send({
        ok: true,
        message: "Workspace actualizado correctamente",
        status: 200,
        data: {
            workspace_updated
        }
    })
}


export async function getAllMemberByWorkspaceId(request, response) {
    const members_obtenidos = await workspace_service.getAllMembersByWorkspaceId(request.workspace._id)
    return response.status(200).send({
        ok: true,
        message: "Obtenidos todos los datos",
        status: 200,
        data: {
            workspaces: members_obtenidos
        }
    })
}
