import * as THREE from "three";
import {group} from "../tool/Element3DGeneraux";


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

    this.badHalfEdges.trous.forEach(he => {
        let edges = [];
        edges.push(new THREE.Vector3(he.headVertex().point.x, he.headVertex().point.y, he.headVertex().point.z));
        edges.push(new THREE.Vector3(he.tailVertex().point.x, he.tailVertex().point.y, he.tailVertex().point.z));
        let edgesGeometry = new THREE.BufferGeometry().setFromPoints(edges);
            let edgesLine = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({color: "rgb(250,26,26)", linewidth : 10}));
            group.add(edgesLine);
    });

    this.badHalfEdges.duplicateHalfedges.forEach(he => {
        let dup = [];
        dup.push(new THREE.Vector3(he.headVertex().point.x, he.headVertex().point.y, he.headVertex().point.z));
        dup.push(new THREE.Vector3(he.tailVertex().point.x, he.tailVertex().point.y, he.tailVertex().point.z));
        let dupGeometry = new THREE.BufferGeometry().setFromPoints(dup);
            let dupLine = new THREE.LineSegments(dupGeometry, new THREE.LineBasicMaterial({color: "rgb(129,0,253)", linewidth : 10}));
            group.add(dupLine);
    })
    console.log(group);
}


