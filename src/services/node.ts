import Node from '../model/node'
import fetch from 'node-fetch'

var nodes:Node[] = []
var me:Node

const register = async () => {
    //Register this node with borrium-authority and get all nodes
    me = new Node(`${process.env.NODE_NAME}`,`${process.env.NODE_URL}`)
    if(!process.env.BORRIUM_AUTHORITY) throw new Error('Missing borrium authority');
    console.info('Registering node with',process.env.BORRIUM_AUTHORITY)
    const response = await fetch(`${process.env.BORRIUM_AUTHORITY}/nodes`,
        {
            method: 'post', 
            body: JSON.stringify(me),  
            headers: { 'Content-Type': 'application/json' 
        }}).then(resp => resp.json())
    if(response.id){
        me.id = response.id
        console.info('Succesfully registered node with id', me.id)
    }
    console.info('Getting nodes from ',process.env.BORRIUM_AUTHORITY )
    nodes = await fetch(`${process.env.BORRIUM_AUTHORITY}/nodes`).then(resp => resp.json())
    console.log("Successfully got nodes: ",nodes)

    console.info('Choosing neighbour')
    const otherNodes = nodes.filter(node => node.id !== me.id)
    if(otherNodes.length > 0){
        const neighbour = otherNodes[Math.floor(Math.random()*otherNodes.length)]
        me.neighbour = neighbour
    }
    return me
}


const addNeighbour = async (neighbour: Node) => {
    const updatedMe = await fetch(`${process.env.BORRIUM_AUTHORITY}/nodes`,
    {
        method: 'put', 
        body: JSON.stringify({me,neighbour: neighbour}),  
        headers: { 'Content-Type': 'application/json' 
    }}).then(resp => resp.json())
    me = updatedMe
}


export {register, addNeighbour}