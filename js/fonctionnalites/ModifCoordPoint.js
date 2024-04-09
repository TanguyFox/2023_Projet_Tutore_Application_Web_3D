/**
 * Module gérant la fonctionnalité de modification des coordonnées d'un point
 */


import {geometry_model, mesh, meshProblems, removeErrors} from "../tool/Element3DGeneraux";
import {Point} from "../structure/Point";
import * as THREE from "three";
import * as generaux from "../tool/Element3DGeneraux";
import * as Scene3D from "../vue/Scene3D";
import {afficherPoints3D, afficherSinglePoint3d, meshvA, meshvB, meshvC, setTransformedPosition} from "./SelectionFace";
import * as Raycaster from "../tool/Raycaster";
import * as Generaux from "../tool/Element3DGeneraux";
import * as SelectionFace from "./SelectionFace.js";
import {animate, intersects} from "../controleurs/Scene3DControleur";

//MODIFICATION DEPUIS LE MENU DE MODIFICATION
let allUuid = [] ;

/**
 * Méthode permettant de récupérer tous les id des points de la structure de données
 */
function getAllUuid (){
    let inputDiv = document.querySelectorAll('.info-point');
    inputDiv.forEach((element) => {
        allUuid.push(element.children[1].id);
    })
}

/**
 * Méthode modifiant les coordonnées d'un point de la structure de données
 * @param event le point cliqué
 */
export function modifCoord(event){
    getAllUuid();
    let divParent = event.target.parentNode; // div parent de l'input cliqué
    let ancienPoint = recreatePointDivParent(divParent); // point à modifier
    majNameDiv(event.target); // mise à jour du champ name de la division html
    let nouveauPoint = createNewPoint(divParent);
    setCoord(ancienPoint, nouveauPoint); // modification des coordonnées du point
    setPoint3D(ancienPoint, nouveauPoint); // mise à jour des coordonnées du point dans la structure 3D
    setPointColore(); // mise à jour du point coloré
}

/**
 * Méthode modifiant les coordonnées des points de la structure de donnée
 * @param ancienPoint le point à trouver dans la structure de données
 * @param newPoint les nouvelles coordonnées du point
 */
 function setCoord(ancienPoint, newPoint) {
    let faces = mesh.faces;
    faces.forEach((uneFace) => {
        let halfedgeDep = uneFace.edge;
        modifCoordPointOfHalfedge(halfedgeDep, ancienPoint, newPoint);
        modifCoordPointOfHalfedge(halfedgeDep.next, ancienPoint, newPoint);
        modifCoordPointOfHalfedge(halfedgeDep.prev, ancienPoint, newPoint);
    })
}

/**
 * Méthode modifiant les coordonnées d'un point d'une demi-arête
 * @param halfedge la demi-arête à modifier
 * @param ancienPoint le point à trouver dans la demi-arête
 * @param newPoint les nouvelles coordonnées du point
 */
function modifCoordPointOfHalfedge(halfedge, ancienPoint, newPoint){
    if(halfedge.vertex.point.equals(ancienPoint)){
        halfedge.vertex.point.set(newPoint);
    }
}

/**
 * Méthode créant un point avec les anciennes valeurs du point modifié
 * @param divParent la div parent du point modifié
 * @returns {Point}
 */
function recreatePointDivParent(divParent){
    let valueX = parseFloat(divParent.children[0].name);
    let valueY = parseFloat(divParent.children[1].name);
    let valueZ = parseFloat(divParent.children[2].name);
    return new Point(valueX, valueY, valueZ);

}

/**
 * Methode qui met à jour le champ name de la division html avec la nouvelle valeur
 * @param targetInput
 */
function majNameDiv(targetInput){
    targetInput.name = targetInput.value;
}

/**
 * Méthode créant un nouveau point avec les nouvelles valeurs des inputs du point modifié
 * @param divParent
 * @returns {Point}
 */
function createNewPoint(divParent){
    let x = parseFloat(divParent.children[0].value);
    let y = parseFloat(divParent.children[1].value);
    let z = parseFloat(divParent.children[2].value);
    return new Point(x, y, z);
}

/**
 * Méthode mettant à jour la positions des points de la structure 3D pour afficher
 * la nouvelle structure modifiée
 * @param targetPoint
 * @param newPoint
 */
function setPoint3D(targetPoint, newPoint){
    //accès à la géométrie de l'objet 3D
    if(geometry_model.isBufferGeometry){
        let positionAttribute = geometry_model.attributes.position;
        let positions = positionAttribute.array;
        let nbPointsSetted = 0;
        let positionAttributeIndex = 0;


        for(let i = 0; i < positions.length; i += 3){
            let pointCourant = new Point(positions[i], positions[i+1],positions[i+2]);
            if(pointCourant.equals(targetPoint)){
                positionAttribute.setXYZ(positionAttributeIndex, newPoint.x, newPoint.y, newPoint.z);
                nbPointsSetted += 1;
            }
            positionAttributeIndex++;
        }
        // Exemple : Création d'arêtes pour un objet Mesh
        majEdges();
        //console.log('SetPoint3D : ' + nbPointsSetted);
        // Mettez à jour le rendu
        geometry_model.computeBoundingSphere(); // Recalcul du sphere de la bounding box
        geometry_model.computeBoundingBox(); // Recalcul de la bounding box
        //geometry_model.computeFaceNormals(); // Recalcul des normales des faces
        geometry_model.computeVertexNormals();
        geometry_model.attributes.position = positionAttribute;
        geometry_model.attributes.position.needsUpdate = true;
        removeErrors();
        meshProblems.highlightProblems();
    }


}

/**
 * Methode mettant à jour la position du point coloré correspondant au point modifié
 */
function setPointColore(){
    for(let i = 0 ; i < intersects.length; i++){
        if(intersects[i].object.uuid === Generaux.meshModel.uuid){
            let transformedPositions = setTransformedPosition(intersects[i].object);
            afficherPoints3D(transformedPositions)
            break;
        }
    }
}

/**
 * Méthode qui met à jour les arêtes de la structure 3D. Supprime les anciennes et redéfinit les nouvelles
 */
export function majEdges(){
    generaux.group.remove(generaux.lineModel);
    Scene3D.scene.remove(generaux.group);
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
//let transformedPosition;
let sauvegardeAncienPoint;

/**
 * Méthode permettant de sélectionner un point de l'objet 3D au clic de la souris
 * @param event
 */
export function setMouseClick(event){
    getAllUuid();

    // Si le point sélectionné est un point de la sphère alors on ne peut pas le déplacer
    if(Scene3D.transformControls.object instanceof THREE.Mesh && Scene3D.transformControls.object.geometry.type === "SphereGeometry"){
        sauvegardeAncienPoint = new Point(pointSelectionne.position.x,
            pointSelectionne.position.y,  pointSelectionne.position.z);
        return;
    }

    // On récupère les objets intersectés par le rayon
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);
    let intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);

    // On parcourt les objets intersectés pour trouver le point sélectionné
    for(let i = 0 ; i < intersects.length; i++){


        if(isMesh(intersects[i].object.uuid)){

            let meshCourant = intersects[i].object;
            isMouseDown = true;
            pointSelectionne = meshCourant;
            sauvegardeAncienPoint = new Point(pointSelectionne.position.x,
                pointSelectionne.position.y,  pointSelectionne.position.z);

            if(pointSelectionne.geometry.type === "SphereGeometry"){
                Scene3D.transformControls.setMode("translate");
            }

            Scene3D.transformControls.attach(pointSelectionne);
            break;
        }
    }
}

// Fonction permettant de savoir si un objet est un mesh
function isMesh(uuid){
    return allUuid.includes(uuid);
}

/**
 * INUTILISEE
 * Méthode permettant de déplacer un point de l'objet 3D
 * @param event
 */
export function deplacerPoint(event) {
    if(isMouseDown && (typeof pointSelectionne !== 'undefined')) {
        if (Scene3D.transformControls.object) {
            //console.log('Nouvelles coordonnées du point :', pointSelectionne.position.x, pointSelectionne.position.y, pointSelectionne.position.z);

        }
    }
}

/**
 * Méthode permettant de réinitialiser les coordonnées du point sélectionné
 */
export function mouseUpReinitialisation(){
    if ( isMouseDown && (typeof pointSelectionne !== 'undefined')) { // Si le point est sélectionné

        // On crée un nouveau point avec les nouvelles coordonnées
        let newPoint = new Point(pointSelectionne.position.x, pointSelectionne.position.y,  pointSelectionne.position.z);
        setCoord(sauvegardeAncienPoint, newPoint); // On modifie les coordonnées du point dans la structure de données
        setPoint3D(sauvegardeAncienPoint, newPoint); // On met à jour les coordonnées du point dans la structure 3D
        majInputPoint(pointSelectionne, newPoint); // On met à jour les coordonnées du point dans le menu de modification

        if(!Scene3D.transformControls.object){
            isMouseDown = false;
            pointSelectionne = undefined;
        }

    }

}

/**
 * Méthode permettant de mettre à jour les coordonnées du point dans le menu de modification
 * @param pointSelectionne le point sélectionné
 * @param newPoint les nouvelles coordonnées du point
 */
function majInputPoint(pointSelectionne, newPoint){
    let div = document.querySelector("[id=\'"+ pointSelectionne.uuid +"\']");

    setName_Value(div.children[0], newPoint.x); // On met à jour les coordonnées en x du point dans le menu de modification
    setName_Value(div.children[1], newPoint.y); // On met à jour les coordonnées en y du point dans le menu de modification
    setName_Value(div.children[2], newPoint.z); // On met à jour les coordonnées en z du point dans le menu de modification
}

/**
 * Méthode permettant de mettre à jour le nom et la valeur d'un élément
 * @param theChildren l'élément à mettre à jour
 * @param theValue la nouvelle valeur de l'élément
 */
function setName_Value(theChildren, theValue){
    theChildren.name = theValue;
    theChildren.value = theValue;
}


export function resetMouseDown_PointSelectionne(){
    isMouseDown = false;
    pointSelectionne = undefined;
}

