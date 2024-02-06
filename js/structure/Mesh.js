import {group, geometry_model, createTriangle, createCylinder} from "../tool/Element3DGeneraux.js";

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

    let errors = Array.from(this.boundaryEdges);

    while (errors.length > 2) {

        let startEdge = errors.shift();
        console.log(startEdge)
        let hole = [startEdge.headVertex(), startEdge.tailVertex()];
        let nextEdgeIndex = errors.findIndex(edge => edge.headVertex().equals(startEdge.tailVertex()));

        while(nextEdgeIndex !== -1) {
            console.log("new triangle")
            console.log(hole)
            let nextEdge = errors[nextEdgeIndex];
            hole.push(nextEdge.tailVertex());
            errors.splice(nextEdgeIndex, 1);
            if (hole.length === 3) {
                let triangle = createTriangle(hole[0], hole[1], hole[2]);
                group.add(triangle);
                nbHoles++;
                break;
            }

            nextEdgeIndex = errors.findIndex(edge => edge.headVertex().equals(nextEdge.tailVertex()));
        }
    }
    if (errors.length > 0) {
        errors.forEach(edge => {
            let cylinder = createCylinder(edge);
            group.add(cylinder);
            problemHE++;
        });
    }

    document.getElementById("nb_trous").innerHTML = nbHoles;
    document.getElementById("nb_hp").innerHTML = problemHE;

    console.log(group)
}


