import {
    group,
    createTriangle,
    createCylinder,
} from "../tool/Element3DGeneraux.js";
import {infoFichierMenuModif} from "../fonctionnalites/InfoFichierPb";
import {getFrontieres} from "../fonctionnalites/FrontiereTrou";

export class Mesh {
    constructor(faces) {
        this.faces = faces;
    }
}

Mesh.prototype.getFacesFromVertex = function (vertex) {
    return this.faces.filter(face => face.getSommets().includes(vertex));
}