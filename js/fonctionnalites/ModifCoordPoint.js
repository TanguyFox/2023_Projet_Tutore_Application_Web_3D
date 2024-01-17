/**
 * Module gérant la fonctionnalité de modification des coordonnées d'un point
 */


import {geometry_model, mesh} from "../tool/Element3DGeneraux";
import {Point} from "../structure/Point";
import * as THREE from "three";
import {camera, scene} from "../vue/Scene3D";
import * as generaux from "../tool/Element3DGeneraux";
import * as Scene3D from "../vue/Scene3D";
import {afficherPoints3D, setTransformedPosition} from "./SelectionFace";
import * as Raycaster from "../tool/Raycaster";
import * as Generaux from "../tool/Element3DGeneraux";
import * as SelectionFace from "./SelectionFace.js";

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
        //EDGE

        for(let i = 0; i < positions.length; i += 3){
            let pointCourant = new Point(positions[i], positions[i+1],positions[i+2]);
            console.log(pointCourant);
            console.log(pointCourant.equals(targetPoint))
            if(pointCourant.equals(targetPoint)){
                positionAttribute.setXYZ(positionAttributeIndex, newPoint.x, newPoint.y, newPoint.z);
                nbPointsSetted += 1;
            }
            positionAttributeIndex++;
        }
        // Exemple : Création d'arêtes pour un objet Mesh
        majEdges();
        console.log('nbPtsSetted : ' + nbPointsSetted);
        // Mettez à jour le rendu
        geometry_model.computeBoundingSphere(); // Recalcul du sphere de la bounding box
        geometry_model.computeBoundingBox(); // Recalcul de la bounding box
        //geometry_model.computeFaceNormals(); // Recalcul des normales des faces
        geometry_model.computeVertexNormals();
        positionAttribute.needsUpdate = true;

        //MAJ point en couleur
        console.log(scene);

        for(let i = 0 ; i < intersects.length; i++){

            if(intersects[i].object.uuid === Generaux.meshModel.uuid){
                let transformedPosition = setTransformedPosition(intersects[i]);
                afficherPoints3D(transformedPosition)
                break;
            }
        }
    }


}

/**
 * Méthode qui met à jour les arêtes de la structure 3D. Supprime les anciennes et redéfinit les nouvelles
 */
function majEdges(){
    generaux.group.remove(generaux.lineModel);
    scene.remove(generaux.group);
    let wireframe = new THREE.WireframeGeometry(geometry_model);
    //couleur de ligne
    generaux.setLineModel(new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x000000})));
    //console.log(generaux.meshModel);
    generaux.setGroup(new THREE.Group());
    generaux.group.add(generaux.meshModel, generaux.lineModel);
    Scene3D.scene.add(generaux.group);
}


//MODIFICATION SUR L'OBJET 3D
let isMouseDown = false;
let pointSelectionne ;
export function setMouseDown(event){
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);
    let intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);

    for(let i = 0 ; i < intersects.length; i++){
        let meshCourant = isMesh(intersects[i].object.uuid)
        if(meshCourant!==null){
            console.log(meshCourant);
            isMouseDown = true;
            pointSelectionne = meshCourant;
            break;
        }
    }
}
function isMesh(uuid){
    if(uuid===SelectionFace.meshvA.uuid){
        return SelectionFace.meshvA;
    }
    if(uuid===SelectionFace.meshvB.uuid){
        return SelectionFace.meshvB;
    }
    if(uuid === SelectionFace.meshvC.uuid){
        return SelectionFace.meshvC;
    }
    return null;
}

//document.addEventListener('mousemove', deplacer)
function deplacer(event) {
    if(isMouseDown && (typeof pointSelectionne !== 'undefined')) {
        console.log('point sélectionné pouvant être déplacé')
    }
    isMouseDown = false;
}


