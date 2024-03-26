export class Mesh {
    constructor(faces) {
        this.faces = faces;
    }
}

Mesh.prototype.getFacesFromVertex = function (vertex) {
    return this.faces.filter(face => face.getSommets().includes(vertex));
}

/**
 * méthode cherchant l'halfege du sommet sans opposée
 * @param sommet
 * @returns {*}
 */
Mesh.prototype.getHalfedgeOfVertexWithoutOpposite = function(sommet){
    let halfedge;
    let i=0;
    let halfedgeCourante;
    while (typeof halfedge === "undefined" && i < this.faces.length){
        halfedgeCourante = this.faces[i].edge;
        //console.log(halfedgeCourante.vertex.point, sommet.point)
        if(halfedgeCourante.vertex.point.equals(sommet.point) &&
            (halfedgeCourante.opposite === null || typeof halfedgeCourante.opposite === "undefined")){
            halfedge = halfedgeCourante;
        } else if (halfedgeCourante.next.vertex.point.equals(sommet.point) &&
            (halfedgeCourante.opposite === null || typeof halfedgeCourante.opposite === "undefined")){
            halfedge = halfedgeCourante.next;
        } else if (halfedgeCourante.prev.vertex.point.equals(sommet.point) &&
            (halfedgeCourante.opposite === null || typeof halfedgeCourante.opposite === "undefined"))
        i++;
    }
    if(typeof halfedge === "undefined")
        console.log("aucune halfedge à ce sommet sans opposée")
    return halfedge;
}