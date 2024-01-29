import * as THREE from "three";
import {group, geometry_model, createTriangle, createCylinder} from "../tool/Element3DGeneraux.js";
import {paintFace} from "../fonctionnalites/SelectionFace.js";


export class Mesh {
    constructor(faces, badHe) {
        this.faces = faces;
        this.badHalfEdges = badHe
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

    geometry_model.computeBoundingSphere();

    this.badHalfEdges.forEach(he => {

        //check if three hedges can form a triangle
        let edge1 = this.badHalfEdges.find(halfedge => halfedge.headVertex().point.equals(he.tailVertex().point));
        let edge2 = this.badHalfEdges.find(halfedge => halfedge.tailVertex().point.equals(he.headVertex().point));

        if (edge1 !== undefined && edge2 !== undefined) {

            let triangleMesh = createTriangle(he, edge1);
            this.badHalfEdges.splice(this.badHalfEdges.indexOf(edge1), 1);
            this.badHalfEdges.splice(this.badHalfEdges.indexOf(edge2), 1);

            group.add(triangleMesh);
            console.log(group)
        } else {
           let cylinderMesh = createCylinder(he);
            //add cylinder to the scene
            group.add(cylinderMesh);
            console.log("missing twin edge")
        }
    });
}


