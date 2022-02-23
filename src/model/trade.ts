import sha256 from 'crypto-js/sha256'
import { ec, ec as EC } from 'elliptic'

export const keyGen = new EC('secp256k1')

export default class Trade {
  from: string
  to: string
  item: string
  hash: string
  signature: string

  constructor(
    from: string,
    to: string,
    item: string,
    hash: string,
    signature: string
  ) {
    this.from = from
    this.to = to
    this.item = item
    this.hash = hash
    this.signature = signature
  }

  generateHash() {
    return sha256(this.from + this.to + this.item).toString()
  }

  isValid() {
    const hash = this.generateHash()
    const validTrade =
      this.hash === hash &&
      keyGen.keyFromPublic(this.from, 'hex').verify(hash, this.signature)
    if (!validTrade) console.error('This trade is invalid: ', this)
    return validTrade
  }
}
