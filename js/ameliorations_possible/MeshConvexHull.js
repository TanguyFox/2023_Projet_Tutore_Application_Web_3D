import {ConvexGeometry, ConvexHull} from "three/addons";
import {group, mesh} from "../tool/Element3DGeneraux";
import * as THREE from "three";

/**
 * EXPERIMENTAL
 * Module permettant de générer un maillage convexe à partir d'un maillage donné
 * Son but est de pouvoir combler les trous d'un maillage de forme convexe
 */

export class MeshConvexHull {
    constructor(mesh) {
        this.mesh = mesh;
        this.convexHull = new ConvexHull().setFromObject(mesh);
    }
}

/**
 * Affiche le maillage convexe sur la scène 3D
 */
MeshConvexHull.prototype.displayConvexHull = function () {
    let geometry = new ConvexGeometry(this.convexHull.vertices.map(v => v.point));
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
}