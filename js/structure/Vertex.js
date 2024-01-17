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

    if (he.opposite === null) {
        //this.halfedgesTab.push(he);
        let opp = this.halfedgesTab.find(halfedge => halfedge.tailVertex() === he.headVertex() && halfedge.headVertex() === this)
        if (opp !== undefined) {
            he.setOpposite(opp)
            opp.setOpposite(he)
            this.halfedgesTab.splice(this.halfedgesTab.indexOf(he), 1)
            this.halfedgesTab.splice(this.halfedgesTab.indexOf(opp), 1)
            this === opp.headVertex() ? opp.tailVertex().halfedgesTab.splice(opp.tailVertex().halfedgesTab.indexOf(opp), 1) : opp.headVertex().halfedgesTab.splice(opp.headVertex().halfedgesTab.indexOf(opp), 1)
            if (this === he.tailVertex()) {
                he.headVertex().halfedgesTab.splice(he.headVertex().halfedgesTab.indexOf(he), 1)
            }
        } else {
            this.halfedgesTab.push(he);
        }
    }
}