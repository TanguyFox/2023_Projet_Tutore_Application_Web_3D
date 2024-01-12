import {scene, transformControls} from "../vue/Scene3D";
import {color_mesh, geometry_model} from "../tool/Element3DGeneraux";
import {arrowHelper} from "../tool/Raycaster";
import * as Generaux from "../tool/Element3DGeneraux";
import * as Raycaster from "../tool/Raycaster";
import * as Scene3D from "../vue/Scene3D";
import * as THREE from "three";
import * as Scene3DControleur from "../controleurs/Scene3DControleur";

/**
 * Module pour la fonctionnalité de traitement de mode (selection de face)
 * @type {HTMLElement}
 */

let modeFaceHtml = document.getElementById('face-mode-check');
let meshvA;
let meshvB;
let meshvC;
let highlightGeometry = new THREE.SphereGeometry(0.05, 16, 16);
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
        scene.remove(arrowHelper);
        let colorAttribute = geometry_model.attributes.color;

        if(Generaux.faceIndexAncien != null){
            paintFace(Generaux.faceIndexAncien, colorAttribute, color_mesh);
        }

        if(Generaux.faceIndexSelected != null){
            paintFace(Generaux.faceIndexSelected, colorAttribute, color_mesh);
        }

        console.log(scene.children.includes(meshvA))
        if(scene.children.includes(meshvA)){
            let info_position_vertexA = document.getElementById('position-vA');
            let info_position_vertexB = document.getElementById('position-vB');
            let info_position_vertexC = document.getElementById('position-vC');

            info_position_vertexA.innerHTML = "";
            info_position_vertexB.innerHTML = "";
            info_position_vertexC.innerHTML = "";

            scene.remove(meshvA);
            scene.remove(meshvB);
            scene.remove(meshvC);



            document.getElementById('color-vA').style.display = "none";
            document.getElementById('color-vB').style.display = "none";
            document.getElementById('color-vC').style.display = "none";
        }

        Generaux.setFaceIndexSelected(null);
        Generaux.setFaceIndexAncien(null);

    }else{
        scene.add(arrowHelper);
        transformControls.detach();
    }
}

export function afficherPoints3D(transformedPositions){

    if(Scene3D.scene.children.includes(meshvA)){
        Scene3D.scene.remove(meshvA);
        Scene3D.scene.remove(meshvB);
        Scene3D.scene.remove(meshvC);
    }

    let offset = Generaux.faceIndexSelected * 3;

    let vertexA = afficherSinglePoint3d(meshvA, transformedPositions, offset);
    let vertexB = afficherSinglePoint3d(meshvB, transformedPositions, (offset+1));
    let vertexC = afficherSinglePoint3d(meshvC, transformedPositions, (offset+2));

    afficherCoordPoints(vertexA, vertexB, vertexC)
}

function afficherSinglePoint3d(mesh, transformedPosition, offsetValue){
    let vertex = new THREE.Vector3(transformedPosition[offsetValue][0],
        transformedPosition[offsetValue][1], transformedPosition[offsetValue][2]);
    mesh.position.copy(vertex);
    Scene3D.scene.add(mesh);
    return vertex;
}

function afficherCoordPoints(vertexA, vertexB, vertexC){
    let infohtml_vertexA = document.getElementById('position-vA');
    let infohtml_vertexB = document.getElementById('position-vB');
    let infohtml_vertexC = document.getElementById('position-vC');

    let info_position_vertexA_color = document.getElementById('color-vA');
    let info_position_vertexB_color = document.getElementById('color-vB');
    let info_position_vertexC_color = document.getElementById('color-vC');


    info_position_vertexA_color.style.display = "block";
    info_position_vertexB_color.style.display = "block";
    info_position_vertexC_color.style.display = "block";

    infohtml_vertexA.innerHTML = "Vertex A : " + vertexA.x + " " + vertexA.y + " " + vertexA.z;
    infohtml_vertexB.innerHTML = "Vertex B : " + vertexB.x + " " + vertexB.y + " " + vertexB.z;
    infohtml_vertexC.innerHTML = "Vertex C : " + vertexC.x + " " + vertexC.y + " " + vertexC.z;
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
            let color = new THREE.Color(0xff0000);
            paintFace(faceIndex, colorAttribute, color);
            Generaux.setFaceIndexAncien(faceIndex);
            break;
        }
    }

}