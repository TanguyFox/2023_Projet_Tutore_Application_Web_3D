import {
    group,
    createTriangle,
    createCylinder,
} from "../tool/Element3DGeneraux.js";
import {infoFichierMenuModif} from "../fonctionnalites/InfoFichierPb";
import {getFrontieres} from "../fonctionnalites/FrontiereTrou";
import {remplirTrouTotal} from "../fonctionnalites/RemplissageTrouCirculaire";

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

    if (this.boundaryEdges.length === 0) {
        group.add(createTriangle(this.boundaryEdges[0].vertex, this.boundaryEdges[1].vertex, this.boundaryEdges[2].vertex));
       document.getElementById("nb_trous").textContent = "1";
    } else {
        //let holes = this.identifyHoles();
        //console.log(holes);
        let holes = getFrontieres(this.boundaryEdges)
        //console.log(holes);
        remplirTrouTotal(holes);
        let triangles = this.triangulateHoles(holes);
        //console.log(triangles);
        if (triangles !== undefined) {
            triangles.forEach(t => {
                let triangle = createTriangle(t[0], t[1], t[2])
                group.add(triangle);
            })
        }
    }
    document.getElementById("nb_hp").innerHTML = problemHE;
    infoFichierMenuModif(this);
    // console.log(group)
}

Mesh.prototype.identifyHoles = function () {
    const holes = [];
    const visited = new Set();

    let startEdge = this.boundaryEdges[0];
    let nextVertex = startEdge.tailVertex();
    visited.add(startEdge);

    let hole = [startEdge.headVertex(), nextVertex];
    while(nextVertex !== startEdge.headVertex()) {
        let bound = this.getFacesFromVertex(nextVertex).find(face => face.getAdjHole() < 3).getBoundaryEdges();
    }

    return holes;
};

Mesh.prototype.triangulateHoles = function (holes) {
    if (holes.length === 0) {
        return;
    }
    let triangles = [];
    holes.forEach(hole => {
      let i = 0;
        while (i < hole.length-2) {
            triangles.push([hole[i], hole[i + 1], hole[i + 2]]);
            i++;
        }
       console.log(triangles);
    });
    document.getElementById("nb_trous").textContent = holes.length;
    return triangles
}

Mesh.prototype.getFacesFromVertex = function (vertex) {
    return this.faces.filter(face => face.getSommets().includes(vertex));
}