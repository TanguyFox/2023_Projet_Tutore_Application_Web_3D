export class HalfEdge {
    constructor(dep) {
        this.vertex = dep;
        this.face = null;
        this.next = null;
        this.prev = null;
        this.opposite = null;
    }
}

HalfEdge.prototype.headVertex = function() { return this.vertex }

HalfEdge.prototype.tailVertex = function () { return this.next.headVertex() ? this.next.headVertex() : null}

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

HalfEdge.prototype.compare = function(halfedge){
    return this.vertex.compare(halfedge.vertex);
}


