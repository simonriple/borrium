import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Block from "../model/block";
import Trade from "../model/trade";
import { blockChain} from "../state/blockChain";

export const TradeService = (ioClient: Socket<DefaultEventsMap, DefaultEventsMap> | null) => {
// const getBlocks = () => {
//     return blockChain.chain;
// }

    const addTrade = (trade: Trade):boolean => {
        ioClient?.emit("trade",trade)
        if(trade.isValid()){
            blockChain.addTrade(trade)
            return true
        } else {
            return false
        }
    }

    return {
        addTrade
    }
}