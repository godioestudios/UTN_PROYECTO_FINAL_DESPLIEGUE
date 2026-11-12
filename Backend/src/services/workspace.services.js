import workspace_repository from "../repositories/workspace.repository.js"
import member_repository from "../repositories/member.repository.js"
import ServerError from "../utils/error.util.js"


/* 
Lista los workspaces del usuario (sus membresias con el rol en cada uno)
y en cada workspace su lista de miembros con nombre y rol
*/
async function getAllWorkspacesByUserId(user_id) {
    const memberships = await member_repository.getAllWorkspaceByUserId(user_id)

    return Promise.all(
        memberships.map(
            async membership => {
                const members = await member_repository.getAllMembersNameAndRolByWorkspaceId(membership.workspace_id)
                return {
                    ...membership,
                    members
                }
            }
        )
    )
}


/* 
Crea el workspace y la membresia owner del usuario que lo creo
*/
async function createWorkspace(user_id, name, description) {
    if (!name) {
        throw new ServerError("name es un campo requerido", 400)
    }

    const workspace_created = await workspace_repository.createWorkspace(name, description)
    const owner_membership = await member_repository.create(
        user_id,
        workspace_created._id,
        'owner'
    )

    return {
        workspace_created,
        owner_membership
    }
}


/* 
Elimina el workspace y todas sus membresias
*/
async function deleteWorkspace(workspace_id) {
    await workspace_repository.deleteById(workspace_id)
    await member_repository.deleteAllMembershipsByWorkspaceId(workspace_id)
}


/* 
Actualiza nombre/descripcion del workspace
*/
async function updateWorkspace(workspace_id, name, description) {
    if (!name || !description) {
        throw new ServerError("name y description son campos requeridos", 400)
    }

    return workspace_repository.updateById(
        workspace_id,
        { nombre: name, description }
    )
}


/* 
Lista los miembros de un workspace
*/
async function getAllMembersByWorkspaceId(workspace_id) {
    return member_repository.getAllMembershipsByWorkspaceId(workspace_id)
}


export default {
    getAllWorkspacesByUserId,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
    getAllMembersByWorkspaceId
}
