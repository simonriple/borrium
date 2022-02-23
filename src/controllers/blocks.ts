import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import Block from '../model/block'
import Trade from '../model/trade'
import { blockChain } from '../state/blockChain'

const BlocksController = ( ioClient: Socket<DefaultEventsMap, DefaultEventsMap> | null) => {

    const getBlocksHandler =  (req: any, res: any) => {
        const blocks = blockChain.getBlocks()
        res.json(blocks)
    }

    return {getBlocksHandler}

}
export {
    BlocksController
}
