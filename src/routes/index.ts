import express from 'express'
import {getStatus} from '../controllers/status'
import {BlocksController} from '../controllers/blocks'
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { TradesController } from '../controllers/trades'

const routes  = ( ioClient: Socket<DefaultEventsMap, DefaultEventsMap> | null) => {

    const router = express.Router()
    //block
    const blocksController = BlocksController( ioClient)
    router.get('/blocks', blocksController.getBlocksHandler)

    //trade
    const tradesController = TradesController(ioClient)
    router.post('/trades', tradesController.postTradeHandler)

    //status
    router.get('/status', getStatus)
    return router
}

export {routes}