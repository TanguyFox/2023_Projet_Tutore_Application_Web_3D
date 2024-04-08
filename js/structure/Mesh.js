import {mesh} from "../tool/Element3DGeneraux";

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
    console.log("dans recherche de l'opposee 1 sommet")
    let halfedge;
    let i=0;
    let halfedgeCourante;
    while (typeof halfedge === "undefined" && i < mesh.faces.length){
        halfedgeCourante = mesh.faces[i].edge;
        //console.log(halfedgeCourante.vertex.point, sommet.point)
        if(halfedgeCourante.vertex.equals(sommet) &&
            (halfedgeCourante.opposite === null || typeof halfedgeCourante.opposite === "undefined")){
            halfedge = halfedgeCourante;
            return halfedgeCourante;
        } else if (halfedgeCourante.next.vertex.equals(sommet) &&
            (halfedgeCourante.next.opposite === null || typeof halfedgeCourante.next.opposite === "undefined")){
            halfedge = halfedgeCourante.next;
            return halfedgeCourante.next;
        } else if (halfedgeCourante.prev.vertex.equals(sommet) &&
            (halfedgeCourante.prev.opposite === null || typeof halfedgeCourante.prev.opposite === "undefined")){
            halfedge = halfedgeCourante.prev;
            return halfedgeCourante.prev;
        }
        i++;
    }
    if(typeof halfedge === "undefined")
        console.log("aucune halfedge à ce sommet sans opposée")
    return halfedge;
}

Mesh.prototype.getHalfedgeBetween2VertexWithoutOpposite = function(sommet1, sommet2){
    console.log("dans recherche de l'opposee 2 sommets", sommet1, sommet2)
    let halfedge;
    let i=0;
    let halfedgeCourante;
    let p1Courant;
    let p2Courant;
    let tabP = [];
    while (typeof halfedge === "undefined" && i < mesh.faces.length){
        halfedgeCourante = mesh.faces[i].edge;
        tabP.push(halfedgeCourante.vertex, halfedgeCourante.next.vertex);
        console.log("tabP 1 : ", tabP.includes(sommet1)&&tabP.includes(sommet2))
        if (tabP.includes(sommet1)&&tabP.includes(sommet2)&&
            (halfedgeCourante.opposite === null || typeof halfedgeCourante.opposite === "undefined")){
            console.log("halfedgeDeH2", halfedgeCourante);

            return halfedgeCourante;
        }
        tabP = [];
        tabP.push(halfedgeCourante.next.vertex, halfedgeCourante.next.next.vertex);
        
        console.log("tabP 2 : ", tabP.includes(sommet1)&&tabP.includes(sommet2))

        if (tabP.includes(sommet1)&&tabP.includes(sommet2)&&
            (halfedgeCourante.next.opposite === null || typeof halfedgeCourante.next.opposite === "undefined")){
            console.log("halfedgeDeH2", halfedgeCourante.next);

            return halfedgeCourante.next;
        }
        tabP = [];
        tabP.push(halfedgeCourante.prev.vertex, halfedgeCourante.vertex);
        console.log("tabP 3 : ", tabP.includes(sommet1)&&tabP.includes(sommet2))

        if (tabP.includes(sommet1)&&tabP.includes(sommet2)&&
            (halfedgeCourante.prev.opposite === null || typeof halfedgeCourante.prev.opposite === "undefined")){
            console.log("halfedgeDeH2", halfedgeCourante.prev);

            return halfedgeCourante.prev;
        }
        i++;
    }
    if(typeof halfedge === "undefined")
        console.log("aucune halfedge à ces sommets sans opposée")
    return halfedge;
}