import {scene, transformControls} from "../vue/Scene3D";
import {color_mesh, geometry_model} from "../tool/Element3DGeneraux";
import {arrowHelper} from "../tool/Raycaster";
import * as Generaux from "../tool/Element3DGeneraux";
import * as Raycaster from "../tool/Raycaster";
import * as Scene3D from "../vue/Scene3D";
import * as THREE from "three";
import * as Scene3DControleur from "../controleurs/Scene3DControleur";
import {initEventInputCoord} from "../controleurs/ModificationMenu";
import {resetMouseDown_PointSelectionne, setMouseClick} from "./ModifCoordPoint";
import {removeSphere} from "./AjoutPoint";

/**
 * Module pour la fonctionnalité de traitement de mode (selection de face)
 * @type {HTMLElement}
 */

let modeFaceHtml = document.getElementById('face-mode-check');
let infoCoordPoints = document.querySelector("#infoCoordPoints");
let meshvA;
let meshvB;
let meshvC;
let highlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
//meshvA couleur: rouge
let highlightMaterial = new THREE.MeshBasicMaterial({color: 0xeb4646});
meshvA = new THREE.Mesh(highlightGeometry, highlightMaterial);
//meshvb couleur: bleu
highlightMaterial = new THREE.MeshBasicMaterial({color: 0x42b0f5});
meshvB = new THREE.Mesh(highlightGeometry, highlightMaterial);
//meshvc couleur: vert
highlightMaterial = new THREE.MeshBasicMaterial({color: 0x42f58d});
meshvC = new THREE.Mesh(highlightGeometry, highlightMaterial);

export function handleModeSelect (event){
    if(!modeFaceHtml.checked && scene.children.includes(arrowHelper)){

        //Supprimer le point jaune
        Scene3D.transformControls.detach();
        resetMouseDown_PointSelectionne();
        removeSphere();

        scene.remove(arrowHelper);
        let colorAttribute = geometry_model.attributes.color;

        if(Generaux.faceIndexAncien != null){
            paintFace(Generaux.faceIndexAncien, colorAttribute, color_mesh);
        }

        if(Generaux.faceIndexSelected != null){
            paintFace(Generaux.faceIndexSelected, colorAttribute, color_mesh);
        }

        if(scene.children.includes(meshvA)){
            document.querySelector("#infoCoordPoints").innerHTML="";
            scene.remove(meshvA);
            scene.remove(meshvB);
            scene.remove(meshvC);
        }
        Generaux.setFaceIndexSelected(null);
        Generaux.setFaceIndexAncien(null);
    }else{
        scene.add(arrowHelper);
        transformControls.detach();
    }
}



/**
 * méthode déclanchée au double clic de la souris sur une face (en mode sélection de face)
 * Elle affiche les trois sommets de la face sur le plan 3D
 * @param transformedPositions
 */
export function afficherPoints3D(transformedPositions){
    removeSphere();
    if(Scene3D.scene.children.includes(meshvA)){
        Scene3D.scene.remove(meshvA);
        Scene3D.scene.remove(meshvB);
        Scene3D.scene.remove(meshvC);
        // console.log(Scene3D.scene);
    }

    let offset = Generaux.faceIndexSelected * 3;

    let vertexA = afficherSinglePoint3d(meshvA, transformedPositions, offset);
    let vertexB = afficherSinglePoint3d(meshvB, transformedPositions, (offset+1));
    let vertexC = afficherSinglePoint3d(meshvC, transformedPositions, (offset+2));

    afficherCoordPoints(vertexA, vertexB, vertexC);

    initEventInputCoord();
}
export function setTransformedPosition (intersectObject){
    let positionAttribute = Generaux.geometry_model.attributes.position;
    // let normalAttribute = Generaux.geometry_model.attributes.normal;
    let matrixWorld = intersectObject.matrixWorld;

    let transformedPositions = [];
    // let transformedNormals = [];

    for(let i = 0; i < positionAttribute.count; i++){
        let localPosition = new THREE.Vector3(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i));
        localPosition.applyMatrix4(matrixWorld);
        transformedPositions.push(localPosition.toArray());
    }
    return transformedPositions;
}

/**
 * méthode qui gère l'affichage d'un seul point
 * @param mesh le sommet qu'on veut afficher
 * @param transformedPosition la position
 * @param offsetValue la valeur dans le tableau de position
 * @returns {Vector3} le sommet
 */
export function afficherSinglePoint3d(mesh, transformedPosition, offsetValue){
    let radius = geometry_model.boundingSphere.radius > 2 ? geometry_model.boundingSphere.radius / 500 : 0.01;
    console.log(mesh.geometry);
    let vertex = new THREE.Vector3(transformedPosition[offsetValue][0],
        transformedPosition[offsetValue][1], transformedPosition[offsetValue][2]);
    mesh.position.copy(vertex);
    Scene3D.scene.add(mesh);
    // console.log(mesh);
    return vertex;
}

/**
 * méthode qui affiche dans le menu les coordonnées des trois points de la face
 * sélectionnée
 * @param vertexA sommet A de la face
 * @param vertexB sommet B de la face
 * @param vertexC sommet C de la face
 */
function afficherCoordPoints(vertexA, vertexB, vertexC){
    infoCoordPoints.innerHTML="";
    afficherSingleCoordPoint('A', meshvA, vertexA, '#eb4646');
    afficherSingleCoordPoint('B', meshvB, vertexB, '#42b0f5');
    afficherSingleCoordPoint('C', meshvC, vertexC, '#42f58d');
}

/**
 * méthode qui crée les div html pour afficher les coordonnées du point
 * @param name
 * @param vertex
 * @param color
 */
export function afficherSingleCoordPoint(name, mesh, vertex, color){
    let divInfo = document.createElement("div");
    infoCoordPoints.appendChild(divInfo);
    divInfo.classList.add('info-point');
    let html = `
    <div class="color_point" style="background-color: ${color}"></div>
    <div id="${mesh.uuid}">${name} : 
    x <input type="number" name="${vertex.x}" title="x" value="${vertex.x.toFixed(3)}">
    y <input type="number" name="${vertex.y}" title="y" value="${vertex.y.toFixed(3)}">
    z <input type="number" name="${vertex.z}" title="x" value="${vertex.z.toFixed(3)}"></div>
    `;
    divInfo.innerHTML = html;
}

//changer la couleur d'une face
export function paintFace(indexFace, colorAttributes, color){
    colorAttributes.setXYZ(indexFace * 3, color.r, color.g, color.b);
    colorAttributes.setXYZ(indexFace * 3 + 1, color.r, color.g, color.b);
    colorAttributes.setXYZ(indexFace * 3 + 2, color.r, color.g, color.b);
    colorAttributes.needsUpdate = true;
}

/**
 * fonction de controle de raycasting. elle génère une flèche sur la face où la souris se situe et change la
 * couleur de la face en même temps
 * @param event
 */
export function onPointerMove( event ){
    Raycaster.pointer.x = (event.clientX / Scene3D.renderer.domElement.clientWidth) * 2 - 1 - 0.005;
    Raycaster.pointer.y = -(event.clientY / Scene3D.renderer.domElement.clientHeight) * 2 + 1 + 0.1;

    if(!modeFaceHtml.checked){
        return;
    }

    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);

    let intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);

    for(let i = 0; i < intersects.length; i ++ ){

        if(intersects[i].object.uuid === Generaux.meshModel.uuid){
            // console.log(intersects[i]);
            let n = new THREE.Vector3();
            n.copy(intersects[i].face.normal);
            n.transformDirection(intersects[i].object.matrixWorld);
            Raycaster.arrowHelper.setDirection(n);
            Raycaster.arrowHelper.position.copy(intersects[i].point);

            if(Generaux.faceIndexSelected != null){
                return;
            }

            let faceIndex = intersects[i].faceIndex;
            let geometry = intersects[i].object.geometry;
            let colorAttribute = geometry.attributes.color;

            if(Generaux.faceIndexAncien != null){
                paintFace(Generaux.faceIndexAncien, colorAttribute, Generaux.color_mesh)
            }

            //couleur de face
            let color = new THREE.Color(0x3655BA);
            paintFace(faceIndex, colorAttribute, color);
            Generaux.setFaceIndexAncien(faceIndex);
            break;
        }
    }

}

export{
    meshvA,
    meshvB,
    meshvC
}