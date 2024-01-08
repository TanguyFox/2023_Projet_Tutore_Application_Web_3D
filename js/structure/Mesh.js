export class Mesh {
    constructor(vertices, faces, points) {
        this.vertices = vertices;
        this.faces = faces;
        this.points = points;
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

