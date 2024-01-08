import {Vertex} from "./Vertex";

export class HalfEdge {
    constructor(vertex) {
        this.vertex = vertex;
        this.face = null;
        this.next = null;
        this.prev = null;
        this.opposite = null;
    }
}

HalfEdge.prototype.setFace = function (face){
    this.face = face;
}

HalfEdge.prototype.setNext= function(next) {
    this.next = next;
}

HalfEdge.prototype.setPrev = function(prev) {
    this.prev = prev;
}

HalfEdge.prototype.setOpposite = function(opposite) {
    this.opposite = opposite;
}

HalfEdge.prototype.toString = function(){
    return "HE{ "  + this.vertex +" }"
}


