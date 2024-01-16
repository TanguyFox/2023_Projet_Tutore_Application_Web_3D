import * as Scene3D from "../vue/Scene3D.js";
import * as THREE from "three";
import {createBoundingBox, removeBoundingBox} from "../vue/BoundingBoxHandler";
import * as Generaux from "../tool/Element3DGeneraux.js";
import * as Raycaster from "../tool/Raycaster.js";
import {paintFace, afficherPoints3D} from "../fonctionnalites/SelectionFace";


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
    // Scene3D.camera.aspect = Scene3D.widthS / Scene3D.heightS;
    // Scene3D.camera.updateProjectionMatrix();
    // Scene3D.renderer.setSize(Scene3D.widthS, Scene3D.heightS);
    // render();
    let menuModification = document.getElementById('menuModification');
    let menuRect = menuModification.getBoundingClientRect();
    let viewHelper = document.getElementById('viewHelper');
    let newRightPosition = window.innerWidth - menuRect.left + 10;
    viewHelper.style.right = newRightPosition + "px";
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

            afficherPoints3D(transformedPositions)

            break;
        }
    }
}




