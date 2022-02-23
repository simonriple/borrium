import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import Block from '../model/block'
import Trade from '../model/trade'
import { TradeService } from '../services/trade'

const TradesController = ( ioClient: Socket<DefaultEventsMap, DefaultEventsMap> | null) => {

    const tradeService = TradeService( ioClient)
    

    const postTradeHandler = (req:any, res: any) => {
        console.log('body', req.body)
        const trade = new Trade(req.body.from, req.body.to, req.body.item, req.body.hash,req.body.signature)
        const status = tradeService.addTrade(trade)
        res.json({success: status})
    }

    return {postTradeHandler}

}
export {
    TradesController
}
