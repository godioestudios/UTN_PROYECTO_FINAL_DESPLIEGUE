import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import workspaceMiddleware from '../middlewares/workspace.middleware.js'
import { createChannel, getAllChanelsByWorkspaceId } from '../controllers/channel.controller.js'

const channel_router = express.Router({ mergeParams: true })

channel_router.get(
    '/',
    authMiddleware,
    workspaceMiddleware(['owner']),
    getAllChanelsByWorkspaceId
)

channel_router.post(
    '/',
    authMiddleware,
    workspaceMiddleware(['owner', 'admin']),
    createChannel
)

export default channel_router
