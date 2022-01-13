const express = require('express')
const fetch = require('node-fetch')

//Chain node
const node = express()
const ip = 'localhost';
const port = process.argv[2] || 3000;
const neighbour = `http://${ip}:${process.argv[3]}`;


let chain = []

node.use(express.json())
node.use(express.static('public'))
node.get('/active', (req,res) => {
    res.json({active: true})
})

node.post('/block', async (req,res) => {
    const block = req.body
    if(!chain.some(entry => entry.id === block.id)){
        chain = [...chain, block]
    console.log("Chain ",chain);
    const url = `${neighbour}/block`
    await fetch(url,{method: 'post', body: JSON.stringify(block),  headers: { 'Content-Type': 'application/json' }})
    }
    res.json({success: true})
})

node.get('/chain', (req,res) => {
    res.json({chain: chain})
})

node.listen(port, () => {console.log(`borrium node running on http://localhost:${port}`)})
