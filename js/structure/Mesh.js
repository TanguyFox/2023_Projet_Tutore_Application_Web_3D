

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



