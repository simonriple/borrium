
export default class Node {
    id:number
    name:string
    url: string
    neighbour: Node

    constructor(name:string, url: string){
        this.name = name
        this.url = url
    }

}