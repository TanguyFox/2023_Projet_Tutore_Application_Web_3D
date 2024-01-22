import * as THREE from "three";
import {afficherPoints3D, afficherSinglePoint3d, setTransformedPosition} from "./SelectionFace";
import {intersects} from "../controleurs/Scene3DControleur";
import * as Generaux from "../tool/Element3DGeneraux";
import * as Scene3D from "../vue/Scene3D";
import * as Raycaster from "../tool/Raycaster";
import {pointer, raycaster} from "../tool/Raycaster";
import {camera, scene, renderer} from "../vue/Scene3D";

export function ajoutPoint(menuContextuel){
    ajPoint3D(menuContextuel.style.left, menuContextuel.style.top);
}


function ajPoint3D(positionX, positionY){
    /*Raycaster.raycaster.setFromCamera(mouse, Scene3D.camera);
    intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);

     */
   /* console.log("ajPoint")
    console.log(intersects)
    if (intersects.length > 0) {
        var intersection = intersects[0];
        console.log('Position de la souris :', mouse);
    }
    let highlightMaterial = new THREE.MeshBasicMaterial({color: 0xeb4646});
    let highlightGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    let point3D = new THREE.Mesh(highlightGeometry, highlightMaterial);
    let vertex = new THREE.Vector3(positionX,
        positionY, mouse.z);
    point3D.position.copy(vertex);
    Scene3D.scene.add(point3D);
    console.log(point3D);

    */
    positionX = positionX.replace("px", '');
    positionY = positionY.replace("px", '');
    console.log("position px : " + positionX +"/"+positionY);

    let mouse = {x : 0, y : 0};
    // Mettez à jour les coordonnées de la souris
    mouse.x = (positionX / window.innerWidth) *2 - 1;
    mouse.y = -(positionY/ window.innerHeight) * 2 +1;
    console.log("position mouse : " + mouse.x + "/"+ mouse.y);


    // Utilisez la fonction unproject pour convertir les coordonnées de l'écran en coordonnées de la scène en 3D
    raycaster.setFromCamera(mouse, camera);

    // Obtenez la liste des objets intersectés
    var intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects)



    // Si des objets sont intersectés, récupérez les coordonnées du premier objet intersecté
    if (intersects.length > 0) {
        var intersection = intersects[0];
        console.log(intersection);
        mouse.z = intersection.z;
        // Créez une nouvelle sphère à la position du clic
        var geometry = new THREE.SphereGeometry(0.1, 32, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(intersection.point);
        console.log(sphere);
        scene.add(sphere);
    }


}
