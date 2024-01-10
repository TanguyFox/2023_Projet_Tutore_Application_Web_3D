import {scene, transformControls} from "../vue/Scene3D";
import {color_mesh, geometry_model} from "../tool/Element3DGeneraux";
import {arrowHelper} from "../tool/Raycaster";
import * as Generaux from "../tool/Element3DGeneraux";
import * as Raycaster from "../tool/Raycaster";
import * as Scene3D from "../vue/Scene3D";
import * as THREE from "three";

/**
 * Module pour la fonctionnalité de sélection des faces
 * @type {HTMLElement}
 */

let modeFaceHtml = document.getElementById('face-mode-check');


export function selectFace (event){
    if(!modeFaceHtml.checked && scene.children.includes(arrowHelper)){
        scene.remove(arrowHelper);
        let colorAttribute = geometry_model.attributes.color;

        if(Generaux.faceIndexAncien != null){
            paintFace(Generaux.faceIndexAncien, colorAttribute, color_mesh);
        }

        if(Generaux.faceIndexSelected != null){
            paintFace(Generaux.faceIndexSelected, colorAttribute, color_mesh);
        }
        Generaux.setFaceIndexSelected(null);
        Generaux.setFaceIndexAncien(null);

    }else{
        scene.add(arrowHelper);
        transformControls.detach();
    }
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