"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _blockChain_instances, _blockChain_chain, _blockChain_miner, _blockChain_mineGenesis, _blockChain_mineInternal;
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = __importDefault(require("./block"));
const trade_1 = __importDefault(require("./trade"));
const worker_threads_1 = require("worker_threads");
class blockChain {
    constructor() {
        _blockChain_instances.add(this);
        _blockChain_chain.set(this, []);
        _blockChain_miner.set(this, void 0);
        this.difficulty = 5;
        const genesis = new block_1.default(null, 'genesishash', this.difficulty);
        __classPrivateFieldGet(this, _blockChain_instances, "m", _blockChain_mineGenesis).call(this, genesis);
    }
    addTrade(trade) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevHash = __classPrivateFieldGet(this, _blockChain_chain, "f")[__classPrivateFieldGet(this, _blockChain_chain, "f").length - 1].hash;
            const block = new block_1.default(trade, prevHash, this.difficulty);
            this.mineBlock(block);
        });
    }
    mineBlock(block) {
        __classPrivateFieldGet(this, _blockChain_instances, "m", _blockChain_mineInternal).call(this, block);
    }
    stopMining() {
        console.log('Stopping mining');
        __classPrivateFieldGet(this, _blockChain_miner, "f").terminate();
    }
    addBlock(block) {
        if (block.isValid()) {
            const oldChain = [...__classPrivateFieldGet(this, _blockChain_chain, "f")];
            __classPrivateFieldGet(this, _blockChain_chain, "f").push(block);
            if (!this.isValid()) {
                __classPrivateFieldSet(this, _blockChain_chain, oldChain, "f");
            }
        }
    }
    getBlocks() {
        return __classPrivateFieldGet(this, _blockChain_chain, "f");
    }
    isValid() {
        for (let i = 1; i < __classPrivateFieldGet(this, _blockChain_chain, "f").length; i++) {
            const prevBlock = __classPrivateFieldGet(this, _blockChain_chain, "f")[i - 1];
            const currBlock = __classPrivateFieldGet(this, _blockChain_chain, "f")[i];
            if (currBlock.prevHash !== prevBlock.hash) {
                console.error('Chain not valid: prevHash error');
                return false;
            }
            if (!currBlock.isValid()) {
                console.error('Chain not valid: this block is not valid', currBlock);
                return false;
            }
        }
        return true;
    }
}
exports.default = blockChain;
_blockChain_chain = new WeakMap(), _blockChain_miner = new WeakMap(), _blockChain_instances = new WeakSet(), _blockChain_mineGenesis = function _blockChain_mineGenesis(genesis) {
    __classPrivateFieldGet(this, _blockChain_instances, "m", _blockChain_mineInternal).call(this, genesis, (minedBlock) => (__classPrivateFieldSet(this, _blockChain_chain, [minedBlock], "f")));
}, _blockChain_mineInternal = function _blockChain_mineInternal(block, callBack = (minedBlock) => this.addBlock(minedBlock)) {
    __classPrivateFieldSet(this, _blockChain_miner, new worker_threads_1.Worker('./dist/workers/miner.js'), "f");
    __classPrivateFieldGet(this, _blockChain_miner, "f").on('message', (minedBlock) => {
        Object.setPrototypeOf(minedBlock, block_1.default.prototype);
        if (minedBlock.trade) {
            Object.setPrototypeOf(minedBlock.trade, trade_1.default.prototype);
        }
        console.log('miner finished mining block');
        callBack(minedBlock);
    });
    __classPrivateFieldGet(this, _blockChain_miner, "f").on('exit', () => {
        console.log('miner exited mining');
    });
    __classPrivateFieldGet(this, _blockChain_miner, "f").postMessage(block);
};
