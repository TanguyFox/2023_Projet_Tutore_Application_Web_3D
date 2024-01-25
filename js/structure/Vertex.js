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

    let opp = he.tailVertex().halfedgesTab.find(halfedge => halfedge.tailVertex() === this)
    if (opp !== undefined) {
        he.setOpposite(opp)
        opp.setOpposite(he)
        opp.headVertex().halfedgesTab.splice(opp.headVertex().halfedgesTab.indexOf(opp), 1)
    } else {
        this.halfedgesTab.push(he)
    }
}

Vertex.prototype.equals = function (vertex) {
    return this.compare(vertex) === 0;
}