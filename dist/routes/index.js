"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const status_1 = require("../controllers/status");
const blocks_1 = require("../controllers/blocks");
const trades_1 = require("../controllers/trades");
const routes = (ioClient) => {
    const router = express_1.default.Router();
    //block
    const blocksController = (0, blocks_1.BlocksController)(ioClient);
    router.get('/blocks', blocksController.getBlocksHandler);
    //trade
    const tradesController = (0, trades_1.TradesController)(ioClient);
    router.post('/trades', tradesController.postTradeHandler);
    //status
    router.get('/status', status_1.getStatus);
    return router;
};
exports.routes = routes;
