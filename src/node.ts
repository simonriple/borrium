import express from 'express'
import { routes } from './routes'
import dotenv from 'dotenv'
import { register } from './services/node'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io, Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { blockChain } from './state/blockChain'
import Block from './model/block'
import Trade from './model/trade'

dotenv.config({ path: `.env.${process.env.CONFIGURATION}` })
const port = process.env.PORT || 3000
console.log('CONFIGURATION', process.env.CONFIGURATION)

// register().then((me) => {
const node = express()
const httpServer = createServer(node)
const ioServer = new Server(httpServer, {})

let ioClient: Socket<DefaultEventsMap, DefaultEventsMap> | null = null
console.log('connecting to ', process.env.BORRIUM_AUTHORITY)
ioClient = io(`${process.env.BORRIUM_AUTHORITY}/nodes`, {
  query: { connectionUrl: `${process.env.NODE_URL}` },
})
ioClient.on('connect_error', (err) => console.log(err))
// console.log('Io client initialized', ioClient)
ioClient.on('connect', () => console.log('connected to authority'))
// if (me.neighbour) {
//   console.log('Connecting to neighbour', me.neighbour)
//   ioClient = io(me.neighbour.url)

//   ioClient.on('connect', () => {
//     console.log('Connected to neighbour', me.neighbour)
//   })
// }
ioServer.on('connection', (socket) => {
  console.log('Someone connected to socket')
  socket.on('block', (block: Block) => {
    console.log('recieved block', block)
    if (block.isValid()) {
      blockChain.stopMining()
      blockChain.addBlock(block)
      console.log('Added valid block from neighbour')
      console.log('Blockchain now', blockChain)
    } else {
      console.log('Block from neighbour not valid')
    }
  })
})

node.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
node.use(express.json())
node.use(express.static('public'))
node.use('/api', routes(ioClient))

httpServer.listen(port, () => {
  console.log(`borrium node running on http://localhost:${port}`)
})
// })
