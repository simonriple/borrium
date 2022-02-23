"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const node_1 = require("./services/node");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_io_client_1 = require("socket.io-client");
const blockChain_1 = require("./state/blockChain");
dotenv_1.default.config({ path: `.env.${process.env.NODE}` });
const port = process.env.PORT || 3000;
(0, node_1.register)().then((me) => {
    const node = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(node);
    const ioServer = new socket_io_1.Server(httpServer, {});
    let ioClient = null;
    if (me.neighbour) {
        console.log('Connecting to neighbour', me.neighbour);
        ioClient = (0, socket_io_client_1.io)(me.neighbour.url);
        ioClient.on('connect', () => {
            console.log('Connected to neighbour', me.neighbour);
        });
    }
    ioServer.on('connection', (socket) => {
        console.log('Someone connected to socket');
        socket.on('block', (block) => {
            console.log('recieved block', block);
            if (block.isValid()) {
                blockChain_1.blockChain.stopMining();
                blockChain_1.blockChain.addBlock(block);
                console.log('Added valid block from neighbour');
                console.log('Blockchain now', blockChain_1.blockChain);
            }
            else {
                console.log('Block from neighbour not valid');
            }
        });
    });
    node.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    node.use(express_1.default.json());
    node.use(express_1.default.static('public'));
    node.use('/api', (0, routes_1.routes)(ioClient));
    httpServer.listen(port, () => {
        console.log(`borrium node running on http://localhost:${port}`);
    });
});
