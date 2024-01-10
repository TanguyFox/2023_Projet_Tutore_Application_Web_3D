import * as Scene3D from "../vue/Scene3D.js";
import {OrbitControls} from "three/addons/controls/OrbitControls";

import * as THREE from "three";
import {createBoundingBox, removeBoundingBox} from "../vue/BoundingBoxHandler";
import * as Generaux from "../tool/Element3DGeneraux.js";
import * as Raycaster from "../tool/Raycaster.js";
import {transformControls} from "../vue/Scene3D.js";
import {paintFace} from "../fonctionnalites/SelectionFace";


/**
 * Module gérant les actions d'affichage de la scene 3D (notamment les actions de visualisation de
 * l'objet 3D)
 */


//Camera Control
let intersects = [];

//check mode face
let modeFaceHtml = document.getElementById('face-mode-check');
//face index


//Render
function render(){
    //Render page
    Scene3D.renderer.render(Scene3D.scene, Scene3D.camera);
}

function onWindowResize(){
    Scene3D.camera.aspect = Scene3D.widthS / Scene3D.heightS;
    Scene3D.camera.updateProjectionMatrix();
    Scene3D.renderer.setSize(Scene3D.widthS, Scene3D.heightS);
    render();
}
window.addEventListener('resize', onWindowResize, false);

//Animation
export function animate(){
    requestAnimationFrame(animate);
    Scene3D.orbitcontrols.update();
    if(Generaux.boundingBoxObject.boundingBox){
        Generaux.boundingBoxObject.boundingBox.update();
    }
    render();
}

//animate();

console.log(Scene3D.transformControls)
if(typeof Scene3D.transformControls!=='undefined'){
    Scene3D.transformControls.addEventListener('change', render);
}

/**
 * génère un boundingBox pour l'objet, sélectionne la face et sélection l'objet
 * @param event
 */
export function onPointerClick( event ){

    // console.log("x:"+pointer.x + " y:" + pointer.y);

    let clickOnObject = false;
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);

    intersects = Raycaster.raycaster.intersectObjects( Scene3D.scene.children );

    if(Generaux.meshModel != null){

        for(let i = 0; i < intersects.length; i ++ ){

            if(intersects[i].object.uuid === Generaux.meshModel.uuid){

                if(!modeFaceHtml.checked){

                    //Bounding Box
                    removeBoundingBox(Generaux.boundingBoxObject);
                    createBoundingBox(Generaux.meshModel, Generaux.boundingBoxObject, Scene3D.scene)

                    Scene3D.transformControls.attach(Generaux.group);
                    clickOnObject = true;
                    break;

                }else{

                    let colorAttribute = Generaux.geometry_model.attributes.color;

                    if(Generaux.faceIndexSelected != null){
                        paintFace(Generaux.faceIndexSelected, colorAttribute, Generaux.color_mesh)
                    }
                    Generaux.setFaceIndexSelected(intersects[i].faceIndex);
                    let color = new THREE.Color(0xff0000);
                    paintFace(Generaux.faceIndexSelected, colorAttribute, color);

                    // let geometry = intersects[i].object.geometry;
                    // let position = geometry.attributes.position.array;
                    //
                    // let offset = faceIndexSelected * 9;
                    // let vertexA = new THREE.Vector3(position[offset], position[offset + 1], position[offset + 2]);
                    // let vertexB = new THREE.Vector3(position[offset + 3], position[offset + 4], position[offset + 5]);
                    // let vertexC = new THREE.Vector3(position[offset + 6], position[offset + 7], position[offset + 8]);
                    //
                    // console.log("orginal vertex");
                    // console.log("faceIndexSelected : " + faceIndexSelected)
                    // console.log(vertexA);
                    // console.log(vertexB);
                    // console.log(vertexC);

                    break;
                }

            }
        }

        if(!clickOnObject){
            removeBoundingBox(Generaux.boundingBoxObject);

            if(!Scene3D.transformControls.dragging){
                Scene3D.transformControls.detach();
            }
        }

    }
}

//Trois sommets d'une face
let meshvA;
let meshvB;
let meshvC;
let highlightGeometry = new THREE.SphereGeometry(0.05, 16, 16);
let highlightMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
meshvA = new THREE.Mesh(highlightGeometry, highlightMaterial);
meshvB = new THREE.Mesh(highlightGeometry, highlightMaterial);
meshvC = new THREE.Mesh(highlightGeometry, highlightMaterial);

let infohtml_vertexA = document.getElementById('info-vA');
let infohtml_vertexB = document.getElementById('info-vB');
let infohtml_vertexC = document.getElementById('info-vC');

export function onDoubleClick(event){
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);
    intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);
    for(let i = 0 ; i < intersects.length; i++){

        if(intersects[i].object.uuid === Generaux.meshModel.uuid){
            let matrixWorld = intersects[i].object.matrixWorld;
            let positionAttribute = Generaux.geometry_model.attributes.position;
            let normalAttribute = Generaux.geometry_model.attributes.normal;

            let transformedPositions = [];
            let transformedNormals = [];

            if(Generaux.faceIndexSelected == null){
                return;
            }

            for(let i = 0; i < positionAttribute.count; i++){
                let localPosition = new THREE.Vector3(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i));
                localPosition.applyMatrix4(matrixWorld);
                transformedPositions.push(localPosition.toArray());
            }

            if(Scene3D.scene.children.includes(meshvA)){
                Scene3D.scene.remove(meshvA);
                Scene3D.scene.remove(meshvB);
                Scene3D.scene.remove(meshvC);
            }

            let offset = Generaux.faceIndexSelected * 3;
            let vertexA = new THREE.Vector3(transformedPositions[offset][0], transformedPositions[offset][1], transformedPositions[offset][2]);
            let vertexB = new THREE.Vector3(transformedPositions[offset + 1][0], transformedPositions[offset + 1][1], transformedPositions[offset + 1][2]);
            let vertexC = new THREE.Vector3(transformedPositions[offset + 2][0], transformedPositions[offset + 2][1], transformedPositions[offset + 2][2]);

            meshvA.position.copy(vertexA);
            meshvB.position.copy(vertexB);
            meshvC.position.copy(vertexC);



            // console.log("transformed vertex")
            // console.log(vertexA);
            // console.log(vertexB);
            // console.log(vertexC);

            // infohtml_vertexA.innerHTML = "Vertex A : " + vertexA.x.toFixed(3) + " " + vertexA.y.toFixed(3) + " " + vertexA.z.toFixed(3);
            // infohtml_vertexB.innerHTML = "Vertex B : " + vertexB.x.toFixed(3) + " " + vertexB.y.toFixed(3) + " " + vertexB.z.toFixed(3);
            // infohtml_vertexC.innerHTML = "Vertex C : " + vertexC.x.toFixed(3) + " " + vertexC.y.toFixed(3) + " " + vertexC.z.toFixed(3);


            infohtml_vertexA.innerHTML = "Vertex A : " + vertexA.x + " " + vertexA.y + " " + vertexA.z;
            infohtml_vertexB.innerHTML = "Vertex B : " + vertexB.x + " " + vertexB.y + " " + vertexB.z;
            infohtml_vertexC.innerHTML = "Vertex C : " + vertexC.x + " " + vertexC.y + " " + vertexC.z;

            Scene3D.scene.add(meshvA);
            Scene3D.scene.add(meshvB);
            Scene3D.scene.add(meshvC);

            break;
        }
    }
}

export {
    meshvA,
    meshvB,
    meshvC
}



