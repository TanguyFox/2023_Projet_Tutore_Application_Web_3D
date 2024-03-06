import {createCylinder, createTriangle, geometry_model, group, mesh, meshModel} from "../tool/Element3DGeneraux";
import {getFrontieres} from "../fonctionnalites/FrontiereTrou";
import {infoFichierMenuModif} from "../fonctionnalites/InfoFichierPb";

export class Problems {
    constructor(boundaryEdges) {
        this.boundaryEdges = boundaryEdges;
        this.newFaces = [];
    }
}

Problems.prototype.addFace = function(newFace) {
    this.newFaces.push(newFace);
}

Problems.prototype.getBoundaryEdges = function() {
    return this.boundaryEdges;
}

Problems.prototype.getNewFaces = function() {
    return this.newFaces;
}

Problems.prototype.highlightProblems = function() {
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
        console.log(holes);
        let triangles = this.triangulateHoles(holes);
        console.log(triangles);
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

Problems.prototype.triangulateHoles = function (holes) {
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

Problems.prototype.repairMesh = function() {
    let model = meshModel;
    this.newFaces.forEach(face => {
        let vertices = face.getSommets();
        vertices.forEach(vertex => {
            model.getAttribute('position').array.push(vertex.x, vertex.y, vertex.z);
        });
    });
}