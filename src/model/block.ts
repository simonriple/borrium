import sha256 from 'crypto-js/sha256'
import Trade from './trade'

export default class Block {
  hash: string
  trade: Trade | null
  difficulty: number
  nonce: number
  prevHash: string

  constructor(trade: Trade | null, prevHash: string, difficulty: number) {
    this.trade = trade
    this.prevHash = prevHash
    this.difficulty = difficulty
    this.nonce = 0
  }

  generateHash() {
    return sha256(
      JSON.stringify(this.trade) + this.prevHash + this.difficulty + this.nonce
    ).toString()
  }

  hashIsValid() {
    return this.hash == this.generateHash()
  }

  proofOfWorkIsValid() {
    return (
      this.hash.slice(0, this.difficulty) ===
      Array(this.difficulty + 1).join('0')
    )
  }

  isValid() {
    const validBlock =
      this.hashIsValid() && this.proofOfWorkIsValid() && this.trade?.isValid()
    if (!validBlock) console.error('This block is invalid: ', this)
    return validBlock
  }

  mine() {
    console.log('mining')
    this.hash = this.generateHash()
    while (!this.proofOfWorkIsValid()) {
      this.nonce += 1
      this.hash = this.generateHash()
    }
    if (this.hashIsValid() && this.proofOfWorkIsValid()) {
      console.log('succesfully mined', this)
      return this
    } else {
      console.error('unsuccesfull mining')
      return
    }
  }
}
