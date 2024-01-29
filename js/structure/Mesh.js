import * as THREE from "three";
import {group, meshModel, geometry_model} from "../tool/Element3DGeneraux.js";
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
        //set height of cylinder equals to the distance between the two vertices
            let height = he.headVertex().point.distance(he.tailVertex().point);
            //adapt radius to the size of the mesh
            let radius = geometry_model.boundingSphere.radius > 2 ? geometry_model.boundingSphere.radius / 500 : 0.01;

            //create cylinder
            let cylinder = new THREE.CylinderGeometry(radius, radius, height, 32);
            let material = new THREE.MeshBasicMaterial({color: "rgb(255, 0, 0)"});
            let cylinderMesh = new THREE.Mesh(cylinder, material);

            //align cylinder on edge
            let center = new THREE.Vector3();
            center.addVectors(he.headVertex().point, he.tailVertex().point);
            center.divideScalar(2);
            cylinderMesh.position.set(center.x, center.y, center.z);
            let direction = new THREE.Vector3();
            direction.subVectors(he.headVertex().point, he.tailVertex().point);
            cylinderMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

            //add cylinder to the scene
            group.add(cylinderMesh);
    });
}


