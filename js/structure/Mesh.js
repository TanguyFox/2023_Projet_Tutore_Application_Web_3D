import {
    group,
    createTriangle,
    createCylinder,
} from "../tool/Element3DGeneraux.js";
import {infoFichierMenuModif} from "../fonctionnalites/InfoFichierPb";

export class Mesh {
    constructor(faces, bhe) {
        this.faces = faces;
        this.boundaryEdges = bhe;
    }
}

Mesh.prototype.detectHoles = function () {
    let holes = [];
    for (let face in this.faces) {
        if (face.getAdjHole() !== 3) {
            holes.push(face);
        }
    }
    return holes;
}

Mesh.prototype.highlightEdge = function () {

    if (this.boundaryEdges.length === 0) {
        document.getElementById("repair_button").disabled = true;
        return;
    }

    document.getElementById("repair_button").disabled = false;

    let nbHoles = 0;
    let problemHE = 0;

    this.boundaryEdges.forEach(edge => {
        let cylinder = createCylinder(edge);
        group.add(cylinder);
        problemHE++;
    })

    let holes = this.identifyHoles();
    console.log(holes);

    let triangles = this.triangulateHoles(holes);
    triangles.forEach(t => {
        let triangle = createTriangle(t[0], t[1], t[2])
        group.add(triangle);
    })

    console.log(triangles)

    document.getElementById("nb_trous").innerHTML = triangles.length;
    document.getElementById("nb_hp").innerHTML = problemHE;
    infoFichierMenuModif(this);
    // console.log(group)
}


Mesh.prototype.identifyHoles = function () {
    const holes = [];
    const visited = new Set();
    const stack = [];

    this.boundaryEdges.forEach(startEdge => {
        if (!visited.has(startEdge)) {
            stack.push(startEdge);
            const hole = [];

            while (stack.length > 0) {
                const currentEdge = stack.pop();

                if (!visited.has(currentEdge)) {
                    visited.add(currentEdge);
                    hole.push(currentEdge);

                    const nextEdge = this.boundaryEdges.find(e => !visited.has(e) && e.tailVertex() === currentEdge.headVertex());

                    if (nextEdge) {
                        stack.push(nextEdge);
                    }
                }
            }

            if (hole.length > 2) holes.push(hole)
        }
    });

    return holes;
}

Mesh.prototype.triangulateHoles = function (holes) {
    let triangles = [];
    holes.forEach(hole => {
        let vertices = hole.map(edge => edge.tailVertex());
        for (let i = 1; i < vertices.length - 1; i++) {
            let triangle = [vertices[0], vertices[i], vertices[i + 1]];
            triangles.push(triangle);
        }
    })
    return triangles
}