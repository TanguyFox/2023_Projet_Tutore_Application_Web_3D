

/**
 * Module gérant la fonctionnalité de modification des coordonnées d'un point
 */

//MODIFICATION DEPUIS LE MENU DE MODIFICATION


export function modifCoord(event){
    setCoord(event.target.value).then();
}

async function setCoord(newValue) {
    const {mesh} = await import("../tool/Element3DGeneraux.js");
    console.log(mesh)
    let faces = mesh.faces;
    faces.forEach((uneFace) => {
        let halfedgeDep = uneFace.edge;
        console.log(halfedgeDep)
    })
}



//MODIFICATION SUR L'OBJET 3D