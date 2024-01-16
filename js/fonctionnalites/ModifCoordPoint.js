/**
 * Module gérant la fonctionnalité de modification des coordonnées d'un point
 */


import {geometry_model, mesh} from "../tool/Element3DGeneraux";
import {Point} from "../structure/Point";
import * as THREE from "three";
import {scene} from "../vue/Scene3D";

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
        let positionAttributeIndex = 0;
        //positionAttribute.setXYZ(0, newPoint.x, newPoint.y, newPoint.z);
        for(let i = 0; i < positions.length; i += 3){
            let pointCourant = new Point(positions[i], positions[i+1],positions[i+2]);
            console.log(pointCourant);
            console.log(pointCourant.equals(targetPoint))
            if(pointCourant.equals(targetPoint)){
                console.log(positionAttribute)
                positionAttribute.setXYZ(positionAttributeIndex, newPoint.x, newPoint.y, newPoint.z);
                console.log(positionAttribute.getZ(positionAttributeIndex));
                nbPointsSetted += 1;
            }
            positionAttributeIndex++;
        }
        // Exemple : Création d'arêtes pour un objet Mesh
        const edges = new THREE.EdgesGeometry(geometry_model); // geometry est la géométrie de votre objet
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // couleur noire pour les arêtes
        const edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
        scene.add(edgesMesh);
        console.log('nbPtsSetted : ' + nbPointsSetted);
        // Mettez à jour le rendu
        geometry_model.computeBoundingSphere(); // Recalcul du sphere de la bounding box
        geometry_model.computeBoundingBox(); // Recalcul de la bounding box
        //geometry_model.computeFaceNormals(); // Recalcul des normales des faces
        geometry_model.computeVertexNormals();
        positionAttribute.needsUpdate = true;
    }


}



//MODIFICATION SUR L'OBJET 3D