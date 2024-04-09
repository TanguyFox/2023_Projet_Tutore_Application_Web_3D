import * as Scene3D from "../vue/Scene3D.js";
import * as THREE from "three";
import * as SecondScene from "../vue/SecondScene.js";
import {createBoundingBox, removeBoundingBox} from "../vue/BoundingBoxHandler";
import * as Generaux from "../tool/Element3DGeneraux.js";
import * as Raycaster from "../tool/Raycaster.js";
import {executeRenderHelper, viewhelper} from "../vue/viewhelper";
import {paintFace, afficherPoints3D, setTransformedPosition} from "../fonctionnalites/SelectionFace";


/**
 * Module gérant les actions d'affichage de la scene 3D (notamment les actions de visualisation de
 * l'objet 3D)
 */


//Camera Control
let intersects = [];

//check mode face
let modeFaceHtml = document.getElementById('face-mode-check'); // Référence à la checkbox de sélection de texture de l'objet

//Scene change
let ModificationMod = true;


//Render
function render(){
    //Render page
    Scene3D.renderer.render(Scene3D.scene, Scene3D.camera);
}

// Mise à jour de la scène lors d'un resize de la fenêtre
function onWindowResize(){

    let navHtmlRect = document.getElementById('nav').getBoundingClientRect();
    let barHtmlRect = document.getElementById('menuModifContent').getBoundingClientRect();

    Scene3D.setWidth_Height(window.innerWidth - barHtmlRect.width, window.innerHeight - navHtmlRect.height);

    Scene3D.camera.aspect = Scene3D.widthS / Scene3D.heightS;
    Scene3D.camera.updateProjectionMatrix();
    Scene3D.renderer.setSize(Scene3D.widthS, Scene3D.heightS);
}

window.addEventListener('resize', onWindowResize);

//Fonction générant l'animation de la scène 3D
export function animate(){
    requestAnimationFrame(animate);
    Scene3D.orbitcontrols.update(); //Mise à jour des contrôles de la caméra

    if(Generaux.boundingBoxObject.boundingBox){
        Generaux.boundingBoxObject.boundingBox.update(); //Mise à jour de la bounding box de l'objet 3D
    }

    if(ModificationMod){
        render();
    }else{
        Scene3D.renderer.render(SecondScene.scene, Scene3D.camera);
    }

    // Mise à jour du repère de la vue
    executeRenderHelper();
}


/**
 * génère un boundingBox pour l'objet, sélectionne la face et l'objet
 * @param event
 */
export function onPointerClick( event ){

    let clickOnObject = false;
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);

    intersects = Raycaster.raycaster.intersectObjects( Scene3D.scene.children ); //Récupération des objets intersectés par le raycaster


    if(Generaux.meshModel != null){

        for(let i = 0; i < intersects.length; i ++ ){

            if(intersects[i].object.uuid === Generaux.meshModel.uuid){ // Si l'objet intersecté est l'objet 3D

                if(!modeFaceHtml.checked){ // Si la sélection de face n'est pas activée

                    //Bounding Box
                    removeBoundingBox(Generaux.boundingBoxObject); //Suppression de la bounding box précédente
                    createBoundingBox(Generaux.meshModel, Generaux.boundingBoxObject, Scene3D.scene) //Création de la bounding box de l'objet 3D

                    Scene3D.transformControls.attach(Generaux.group); //Attachement des contrôles de transformation à l'objet 3D
                    clickOnObject = true;
                    break;

                }else{ // sinon


                    let colorAttribute = Generaux.geometry_model.attributes.color;

                    // Si une face est déjà sélectionnée, on la déselectionne
                    if(Generaux.faceIndexSelected != null){
                        paintFace(Generaux.faceIndexSelected, colorAttribute, Generaux.color_mesh)
                    }
                    // On sélectionne la face cliquée et on la colore
                    Generaux.setFaceIndexSelected(intersects[i].faceIndex);
                    let color = new THREE.Color(0x3655BA);
                    paintFace(Generaux.faceIndexSelected, colorAttribute, color);

                    break;
                }

            }
        }

        // Si aucun objet n'a été cliqué on supprime la bounding box et on détache les contrôles de transformation
        if(!clickOnObject){
            removeBoundingBox(Generaux.boundingBoxObject);

            if(!Scene3D.transformControls.dragging){
                Scene3D.transformControls.detach();
            }
        }
    }
}

/**
 * Fonction permettant de gérer le double click sur un objet 3D
 * Cette fonction permet de centrer la caméra sur l'objet 3D
 * ou de sélectionner une face de l'objet 3D
 * @param event
 */
export function onDoubleClick(event){

    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);
    intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);
    for(let i = 0 ; i < intersects.length; i++){

        if(intersects[i].object.uuid === Generaux.meshModel.uuid){

            if(Generaux.faceIndexSelected == null){ //Si aucune face n'est sélectionnée
                const boundingBox = new THREE.Box3().setFromObject(Generaux.meshModel);
                const center = boundingBox.getCenter(new THREE.Vector3()); //Calcul du centre de l'objet 3D
                const offset = center.clone().sub(Scene3D.orbitcontrols.target); //Calcul de l'offset entre le centre de l'objet 3D et la cible de la caméra
                Scene3D.camera.position.add(offset); //Déplacement de la caméra
                Scene3D.orbitcontrols.target.copy(center); //Déplacement de la cible de la caméra
                viewhelper.center.copy(center); //Déplacement du centre du repère de la vue

                //Pour Deuxième scène
                SecondScene.group.position.copy(Scene3D.orbitcontrols.target);

                return;
            }

            // Si une face est sélectionnée, on affiche les points 3D de la face
            let transformedPositions = setTransformedPosition(intersects[i].object);
            afficherPoints3D(transformedPositions) //Affichage des points 3D de la face sélectionnée dans la scène 3D
            break;
        }
    }
}

//Scene switch
let secondSceneHtml = document.getElementById('scene-switch'); // Référence à l'élément HTML permettant de changer de scène

let sceneMessageHtml = document.getElementById('scene-message'); // Référence à l'élément HTML affichant un message lors du changement de scène

let sceneSwitchImgHtml = document.getElementById('scene-switch-img'); // Référence à l'élément HTML affichant l'icône de changement de scène

/**
 * Fonction permettant de changer de scène
 * Cette fonction permet de passer de la scène de modification à la scène de visualisation
 */
secondSceneHtml.addEventListener('click', function () {
    ModificationMod = !ModificationMod; //Changement de mode de la scène

    if(!ModificationMod){
        sceneMessageHtml.style.animationName = "fadeIn"; //Animation d'affichage du message de changement de scène
        sceneSwitchImgHtml.src = "resources/img/sceneChange/edit.svg";
    }else{
        sceneMessageHtml.style.animationName = "fadeOut"; //Animation de disparition du message de changement de scène
        sceneSwitchImgHtml.src = "resources/img/sceneChange/view.svg";
    }
});


export {
    intersects,
    ModificationMod
}






