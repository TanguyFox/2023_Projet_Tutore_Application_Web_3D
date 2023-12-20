export class Mesh {
    constructor(vertices, faces) {
        this.vertices = vertices;
        this.faces = faces;
    }

    detectHoles() {
        let holes = [];
        for(let face in this.faces) {
            if (face.getAdjHole() !== 3) {
                holes.push(face);
            }
        }
        return holes;
    }

}

