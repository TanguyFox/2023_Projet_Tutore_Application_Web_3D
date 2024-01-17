export class Vertex {

    constructor(depart) {
        this.point = depart;
        this.halfedgesTab = [];
    }
}

Vertex.prototype.setEdge = function (edge) {
    this.edge = edge;
}

Vertex.prototype.toString = function () {
    return "Vertex{ " + this.point + " }"
}

Vertex.prototype.compare = function (vertex) {
    return this.point.compare(vertex.point);
}

Vertex.prototype.addHalfEdge = function (he) {

    //this.halfedgesTab.push(he);
    let opp = this.halfedgesTab.find(halfedge => halfedge.tailVertex() === this && halfedge.headVertex() === he.tailVertex())
    console.log("expected : " + he.tailVertex() + " " + he.headVertex())
    console.warn("found : " + opp)
    if (opp !== undefined) {
        he.setOpposite(opp)
        opp.setOpposite(he)
        this.halfedgesTab.splice(this.halfedgesTab.indexOf(opp), 1)
        console.log("opposite deleted from departure : " + this.halfedgesTab.indexOf(opp))
        he.tailVertex().halfedgesTab.splice(he.tailVertex().halfedgesTab.indexOf(opp), 1)
        console.log("opposite deleted from arrival : " + he.tailVertex().halfedgesTab.indexOf(opp))
    } else {
        this.halfedgesTab.push(he);
        console.log("opposite not found, he added")
    }
}