/**
 * Module gérant la fonctionnalité de modification des coordonnées d'un point
 */


import {geometry_model, mesh} from "../tool/Element3DGeneraux";
import {Point} from "../structure/Point";

//MODIFICATION DEPUIS LE MENU DE MODIFICATION


export function modifCoord(event){
    let divParent = event.target.parentNode;
    console.log(divParent);
    let ancienPoint = recreatePointDivParent(divParent);
    majNameDiv(event.target);
    let nouveauPoint = createNewPoint(divParent);
    setCoord(ancienPoint,event.target.title, nouveauPoint);
    setPoint3D(ancienPoint, nouveauPoint);
}

 function setCoord(ancienPoint, coordonneeChangee, newPoint) {
    console.log(mesh);
    let faces = mesh.faces;
    console.log(ancienPoint);
    faces.forEach((uneFace) => {
        let halfedgeDep = uneFace.edge;
        if(halfedgeDep.vertex.point.equals(ancienPoint)){
            halfedgeDep.vertex.point.set(newPoint);
            console.log('nouvelles coordonnees : ');
            console.log(halfedgeDep.vertex.point);
        }
    })
}

function recreatePointDivParent(divParent){
    let valueX = parseFloat(divParent.children[0].name);
    let valueY = parseFloat(divParent.children[1].name);
    let valueZ = parseFloat(divParent.children[2].name);
    return new Point(valueX, valueY, valueZ);

}

function majNameDiv(targetInput){
    targetInput.name = targetInput.value;
}

function createNewPoint(divParent){
    let x = parseFloat(divParent.children[0].value);
    let y = parseFloat(divParent.children[1].value);
    let z = parseFloat(divParent.children[2].value);
    return new Point(x, y, z);
}

function setPoint3D(targetPoint, newPoint){
    //accès à la géométrie de l'objet 3D
    if(geometry_model.isBufferGeometry){
        let positionAttribute = geometry_model.attributes.position;
        let positions = positionAttribute.array;
        let nbPointsSetted = 0;
        for(let i = 0; i < positions.length; i += 3){
            let pointCourant = newPoint(positions[i], positions[i+1],positions[i+2]);
            if(pointCourant.equal(targetPoint)){
                positionAttribute.setXYZ(i/3, newPoint.x, newPoint.y, newPoint.z);
                nbPointsSetted += 1;
            }
        }
        console.log('nbPtsSetted : ' + nbPointsSetted);

    }
}



//MODIFICATION SUR L'OBJET 3D