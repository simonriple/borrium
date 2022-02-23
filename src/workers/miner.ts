import Block from '../model/block'

const { parentPort } = require('worker_threads')

const mineBlock = (block: Block) => {
  Object.setPrototypeOf(block, Block.prototype)
  block.mine()
  parentPort.postMessage(block)
}

parentPort.on('message', (block: Block) => mineBlock(block))
