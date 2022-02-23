"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksController = void 0;
const blockChain_1 = require("../state/blockChain");
const BlocksController = (ioClient) => {
    const getBlocksHandler = (req, res) => {
        const blocks = blockChain_1.blockChain.getBlocks();
        res.json(blocks);
    };
    return { getBlocksHandler };
};
exports.BlocksController = BlocksController;
