import Block from './block'
import Trade from './trade'
import { Worker } from 'worker_threads'

export default class blockChain {
  #chain: Block[] = []
  #miner: Worker
  difficulty = 5

  constructor() {
    const genesis = new Block(null, 'genesishash', this.difficulty)
    this.#mineGenesis(genesis)
  }

  async addTrade(trade: Trade) {
    const prevHash = this.#chain[this.#chain.length - 1].hash
    const block = new Block(trade, prevHash, this.difficulty)

    this.mineBlock(block)
  }

  #mineGenesis(genesis: Block) {
    this.#mineInternal(
      genesis,
      (minedBlock: Block) => (this.#chain = [minedBlock])
    )
  }

  mineBlock(block: Block) {
    this.#mineInternal(block)
  }

  #mineInternal(
    block: Block,
    callBack: (minedBlock: Block) => void = (minedBlock) =>
      this.addBlock(minedBlock)
  ) {
    this.#miner = new Worker('./dist/workers/miner.js')
    this.#miner.on('message', (minedBlock: Block) => {
      Object.setPrototypeOf(minedBlock, Block.prototype)
      if (minedBlock.trade) {
        Object.setPrototypeOf(minedBlock.trade, Trade.prototype)
      }
      console.log('miner finished mining block')
      callBack(minedBlock)
    })
    this.#miner.on('exit', () => {
      console.log('miner exited mining')
    })

    this.#miner.postMessage(block)
  }

  stopMining() {
    console.log('Stopping mining')
    this.#miner.terminate()
  }

  addBlock(block: Block) {
    if (block.isValid()) {
      const oldChain = [...this.#chain]
      this.#chain.push(block)
      if (!this.isValid()) {
        this.#chain = oldChain
      }
    }
  }

  getBlocks() {
    return this.#chain
  }

  isValid() {
    for (let i = 1; i < this.#chain.length; i++) {
      const prevBlock = this.#chain[i - 1]
      const currBlock = this.#chain[i]

      if (currBlock.prevHash !== prevBlock.hash) {
        console.error('Chain not valid: prevHash error')
        return false
      }

      if (!currBlock.isValid()) {
        console.error('Chain not valid: this block is not valid', currBlock)
        return false
      }
    }
    return true
  }
}
