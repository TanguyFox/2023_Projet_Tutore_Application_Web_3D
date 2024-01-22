import * as THREE from "three";
import {afficherPoints3D, afficherSinglePoint3d, setTransformedPosition} from "./SelectionFace";
import {intersects} from "../controleurs/Scene3DControleur";
import * as Generaux from "../tool/Element3DGeneraux";
import * as Scene3D from "../vue/Scene3D";
import * as Raycaster from "../tool/Raycaster";
import {int} from "three/nodes";

export function ajoutPoint(menuContextuel){
    ajPoint3D(menuContextuel.style.left, menuContextuel.style.top);
}


function ajPoint3D(positionX, positionY){

    // positionX = positionX.replace("px", '');
    // positionY = positionY.replace("px", '');
    // console.log("position px : " + positionX +"/"+positionY);

    let mouse = {x : 0, y : 0};
    mouse.x = Raycaster.pointer.x;
    mouse.y = Raycaster.pointer.y;
    // console.log("position mouse : " + mouse.x + "/"+ mouse.y);

    // Utilisez la fonction unproject pour convertir les coordonnées de l'écran en coordonnées de la scène en 3D
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);

    // Obtenez la liste des objets intersectés
    let intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);
    console.log(intersects)

    let isObject = false;

    // Créez une nouvelle sphère à la position du clic
    let geometry = new THREE.SphereGeometry(0.1, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    let sphere = new THREE.Mesh(geometry, material);

    for(let i = 0; i < intersects.length; i ++ ){

        if(intersects[i].object.uuid === Generaux.meshModel.uuid){
            console.log(intersects[i]);
            isObject = true;

            sphere.position.copy(intersects[i].point);
            break;
        }
    }

    if(!isObject){
        Generaux.meshModel.geometry.computeBoundingBox();
        let localCenter = new THREE.Vector3();
        Generaux.meshModel.geometry.boundingBox.getCenter(localCenter);
        let worldCenter = Generaux.meshModel.localToWorld(localCenter);

        let planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), -worldCenter.y);
        let intersectPoint = new THREE.Vector3();
        Raycaster.raycaster.ray.intersectPlane(planeY, intersectPoint);
        sphere.position.copy(intersectPoint);
    }

    Scene3D.scene.add(sphere);
}
