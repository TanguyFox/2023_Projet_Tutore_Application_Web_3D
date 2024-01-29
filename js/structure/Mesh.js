import * as THREE from "three";
import {group, geometry_model, createTriangle, createCylinder} from "../tool/Element3DGeneraux.js";
import {paintFace} from "../fonctionnalites/SelectionFace.js";


export class Mesh {
    constructor(faces, bhe) {
        this.faces = faces;
        this.boundaryEdges = bhe;
    }
}

Mesh.prototype.detectHoles = function(){
    let holes = [];
    for(let face in this.faces) {
        if (face.getAdjHole() !== 3) {
            holes.push(face);
        }
    }
    return holes;
}

Mesh.prototype.setMeshGeneraux = async function (){
    const { setMesh } = await import('../tool/Element3DGeneraux.js');
    console.log(setMesh);
    setMesh(this);
    const { mesh } = await import('../tool/Element3DGeneraux.js');
    console.log(mesh);
    return mesh;
}

Mesh.prototype.highlightEdge = function () {

    if (this.boundaryEdges.length ===0) {
        return;
    }
    geometry_model.computeBoundingSphere();
    let nbHoles = 0;
    let problemHE = 0;

    this.boundaryEdges.forEach(he => {



        //check if three hedges can form a triangle
        let edge1 = this.boundaryEdges.find(halfedge => halfedge.headVertex().equals(he.tailVertex()));
        let edge2 = this.boundaryEdges.find(halfedge => halfedge.tailVertex().equals(he.headVertex()));

        if (edge1 !== undefined && edge2 !== undefined) {

            let triangleMesh = createTriangle(he, edge1);
            this.boundaryEdges.splice(this.boundaryEdges.indexOf(edge1), 1);
            this.boundaryEdges.splice(this.boundaryEdges.indexOf(edge2), 1);

            group.add(triangleMesh);
            nbHoles++

        } else {
           let cylinderMesh = createCylinder(he);
            //add cylinder to the scene
            group.add(cylinderMesh);
            problemHE++;
        }
    });
    document.getElementById("nb_trous").innerHTML = nbHoles;
    document.getElementById("nb_hp").innerHTML = problemHE;

}


