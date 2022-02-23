"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = __importDefault(require("../model/block"));
const { parentPort } = require('worker_threads');
const mineBlock = (block) => {
    Object.setPrototypeOf(block, block_1.default.prototype);
    block.mine();
    parentPort.postMessage(block);
};
parentPort.on('message', (block) => mineBlock(block));
