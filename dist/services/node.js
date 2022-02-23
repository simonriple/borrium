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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNeighbour = exports.register = void 0;
const node_1 = __importDefault(require("../model/node"));
const node_fetch_1 = __importDefault(require("node-fetch"));
var nodes = [];
var me;
const register = () => __awaiter(void 0, void 0, void 0, function* () {
    //Register this node with borrium-authority and get all nodes
    me = new node_1.default(`${process.env.NODE_NAME}`, `${process.env.NODE_URL}`);
    if (!process.env.BORRIUM_AUTHORITY)
        throw new Error('Missing borrium authority');
    console.info('Registering node with', process.env.BORRIUM_AUTHORITY);
    const response = yield (0, node_fetch_1.default)(`${process.env.BORRIUM_AUTHORITY}/nodes`, {
        method: 'post',
        body: JSON.stringify(me),
        headers: { 'Content-Type': 'application/json'
        }
    }).then(resp => resp.json());
    if (response.id) {
        me.id = response.id;
        console.info('Succesfully registered node with id', me.id);
    }
    console.info('Getting nodes from ', process.env.BORRIUM_AUTHORITY);
    nodes = yield (0, node_fetch_1.default)(`${process.env.BORRIUM_AUTHORITY}/nodes`).then(resp => resp.json());
    console.log("Successfully got nodes: ", nodes);
    console.info('Choosing neighbour');
    const otherNodes = nodes.filter(node => node.id !== me.id);
    if (otherNodes.length > 0) {
        const neighbour = otherNodes[Math.floor(Math.random() * otherNodes.length)];
        me.neighbour = neighbour;
    }
    return me;
});
exports.register = register;
const addNeighbour = (neighbour) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedMe = yield (0, node_fetch_1.default)(`${process.env.BORRIUM_AUTHORITY}/nodes`, {
        method: 'put',
        body: JSON.stringify({ me, neighbour: neighbour }),
        headers: { 'Content-Type': 'application/json'
        }
    }).then(resp => resp.json());
    me = updatedMe;
});
exports.addNeighbour = addNeighbour;
