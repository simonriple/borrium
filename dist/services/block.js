"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockService = void 0;
const blockChain_1 = require("../state/blockChain");
const BlockService = (ioClient) => {
    const getBlocks = () => {
        return blockChain_1.blockChain.chain;
    };
    const addTrade = (trade) => {
        blockChain_1.blockChain.addBlock(trade);
        ioClient === null || ioClient === void 0 ? void 0 : ioClient.emit("blocks", blockChain_1.blockChain.chain);
    };
    // const addBlock = (block:Block) => {
    //     blockChain.addBlock(block)
    //     return block
    // }
    return { getBlocks, addTrade };
};
exports.BlockService = BlockService;
