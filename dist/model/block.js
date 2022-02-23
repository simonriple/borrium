"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("crypto-js/sha256"));
class Block {
    constructor(trade, prevHash, difficulty) {
        this.trade = trade;
        this.prevHash = prevHash;
        this.difficulty = difficulty;
        this.nonce = 0;
    }
    generateHash() {
        return (0, sha256_1.default)(JSON.stringify(this.trade) + this.prevHash + this.difficulty + this.nonce).toString();
    }
    hashIsValid() {
        return this.hash == this.generateHash();
    }
    proofOfWorkIsValid() {
        return (this.hash.slice(0, this.difficulty) ===
            Array(this.difficulty + 1).join('0'));
    }
    isValid() {
        var _a;
        const validBlock = this.hashIsValid() && this.proofOfWorkIsValid() && ((_a = this.trade) === null || _a === void 0 ? void 0 : _a.isValid());
        if (!validBlock)
            console.error('This block is invalid: ', this);
        return validBlock;
    }
    mine() {
        console.log('mining');
        this.hash = this.generateHash();
        while (!this.proofOfWorkIsValid()) {
            this.nonce += 1;
            this.hash = this.generateHash();
        }
        if (this.hashIsValid() && this.proofOfWorkIsValid()) {
            console.log('succesfully mined', this);
            return this;
        }
        else {
            console.error('unsuccesfull mining');
            return;
        }
    }
}
exports.default = Block;
