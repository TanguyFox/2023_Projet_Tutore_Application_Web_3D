export class Mesh {
    constructor(faces) {
        this.faces = faces;
        this.setMeshGeneraux(this).then();
    }

    async setMeshGeneraux() {
        // Import dynamique de la méthode setMesh depuis Generaux.js
        const { setMesh } = await import('../tool/Element3DGeneraux.js');
        console.log(setMesh);
        setMesh(this);

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



