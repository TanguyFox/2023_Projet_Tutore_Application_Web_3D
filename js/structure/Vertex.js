export class Vertex{

    constructor(depart) {
        this.point = depart;
        this.halfedgesTab = [];
    }
}

Vertex.prototype.setEdge = function(edge){
    this.edge = edge;
}

Vertex.prototype.toString = function(){
    return "Vertex{ "  + this.point +" }"
}

Vertex.prototype.compare = function(vertex){
    return this.point.compare(vertex.point);
}

Vertex.prototype.addHalfEdge = function(he) {
    const opposite = this.halfedgesTab.find(halfedge => halfedge.tailVertex() === this && halfedge.headVertex() === he.tailVertex())
    if(opposite !== undefined) {
        he.setOpposite(opposite)
        opposite.setOpposite(he)
        this.halfedgesTab.splice(this.halfedgesTab.indexOf(opposite)-1, 1)
    } else {
        this.halfedgesTab.push(he);
    }
}