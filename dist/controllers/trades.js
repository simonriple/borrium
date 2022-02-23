"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesController = void 0;
const trade_1 = __importDefault(require("../model/trade"));
const trade_2 = require("../services/trade");
const TradesController = (ioClient) => {
    const tradeService = (0, trade_2.TradeService)(ioClient);
    const postTradeHandler = (req, res) => {
        console.log('body', req.body);
        const trade = new trade_1.default(req.body.from, req.body.to, req.body.item, req.body.hash, req.body.signature);
        const status = tradeService.addTrade(trade);
        res.json({ success: status });
    };
    return { postTradeHandler };
};
exports.TradesController = TradesController;
