"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyGen = void 0;
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const elliptic_1 = require("elliptic");
exports.keyGen = new elliptic_1.ec('secp256k1');
class Trade {
    constructor(from, to, item, hash, signature) {
        this.from = from;
        this.to = to;
        this.item = item;
        this.hash = hash;
        this.signature = signature;
    }
    generateHash() {
        return (0, sha256_1.default)(this.from + this.to + this.item).toString();
    }
    isValid() {
        const hash = this.generateHash();
        const validTrade = this.hash === hash &&
            exports.keyGen.keyFromPublic(this.from, 'hex').verify(hash, this.signature);
        if (!validTrade)
            console.error('This trade is invalid: ', this);
        return validTrade;
    }
}
exports.default = Trade;
