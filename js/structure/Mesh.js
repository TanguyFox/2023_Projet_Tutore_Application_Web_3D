export class Mesh {
    constructor(faces) {
        this.faces = faces;
    }
}

Mesh.prototype.getFacesFromVertex = function (vertex) {
    return this.faces.filter(face => face.getSommets().includes(vertex));
}