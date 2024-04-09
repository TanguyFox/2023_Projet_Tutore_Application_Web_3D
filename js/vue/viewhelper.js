import * as THREE from 'three';
import {ViewHelper} from 'three/addons/helpers/ViewHelper.js'
import {camera, orbitcontrols} from "./Scene3D";

/**
 * Module gérant le repère 3D de la scène
 */

let renderer;
let viewhelper;
let clock;

/**
 * Méthode permettant de créer le repère 3D de la scène
 */
function initViewHelper(){
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const sceneContainerHelper = document.getElementById('viewHelper');
    const width = 128
    const height = 128
    clock = new THREE.Clock();
    renderer.setClearColor(0x000000, 0); // Initialisation du renderer avec un fond transparent
    renderer.setSize(width, height); // Initialisation de la taille du renderer
    sceneContainerHelper.appendChild(renderer.domElement);
    viewhelper = new ViewHelper(camera, renderer.domElement); // Initialisation du repère 3D
    viewhelper.controls = orbitcontrols;
    viewhelper.controls.center = orbitcontrols.target;
    sceneContainerHelper.addEventListener('pointerup', (event) => viewhelper.handleClick(event));
    // animate();
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if(viewhelper.animating) viewhelper.update(delta);
    viewhelper.render(renderer);
}

/**
 * Méthode permettant de mettre à jour le repère 3D de la scène quand la caméra bouge
 */
function executeRenderHelper(){
    const delta = clock.getDelta();
    if(viewhelper.animating) viewhelper.update(delta);
    viewhelper.render(renderer);
}

export { initViewHelper, viewhelper, executeRenderHelper }