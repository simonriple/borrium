"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeService = void 0;
const blockChain_1 = require("../state/blockChain");
const TradeService = (ioClient) => {
    // const getBlocks = () => {
    //     return blockChain.chain;
    // }
    const addTrade = (trade) => {
        ioClient === null || ioClient === void 0 ? void 0 : ioClient.emit("trade", trade);
        if (trade.isValid()) {
            blockChain_1.blockChain.addTrade(trade);
            return true;
        }
        else {
            return false;
        }
    };
    return {
        addTrade
    };
};
exports.TradeService = TradeService;
