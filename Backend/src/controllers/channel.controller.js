import channel_repository from "../repositories/channel.repository.js"
import ServerError from "../utils/error.util.js"

//createChannel
//deleteById
//updateById

export async function getAllChanelsByWorkspaceId(request,response) {
    const canales_obtenidos = await channel_repository.getAllChannelsByWorkpaceId(request.workspace._id)
    return response.status(200).send({
        ok: true,
        message : "Obtenidos todos los datos",
        status: 200,
        data:{
            channels: canales_obtenidos
        }
    })
}



export async function createChannel(request,response) {
    const { name, description } = request.body

    if (!name) {
        throw new ServerError("name es un campo requerido", 400)
    }

    const canal_creado = await channel_repository.createChannel(
        name,
        description,
        request.workspace._id
    )
    return response.status(201).send({
        ok: true,
        message : "Canal Creado",
        status: 201,
        data:{
            channel : canal_creado
        }
    })
}





