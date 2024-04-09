//Raycaster
import * as THREE from "three";

/**
 * module modélisant le raycaster
 * @type {Raycaster}
 */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(); // Coordonnées du pointeur de la souris

// Flèche indiquant l'élément survolé
const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(), new THREE.Vector3(), 0.5, 0x00a6ff, 0.1, 0.1);

export{
    raycaster,
    pointer,
    arrowHelper
}





