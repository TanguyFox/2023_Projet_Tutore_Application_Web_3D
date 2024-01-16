import * as THREE from 'three';
import {ViewHelper} from 'three/addons/helpers/ViewHelper.js'
import {camera, orbitcontrols} from "./Scene3D";

let renderer;
let viewhelper;
let clock;

function initViewHelper(){
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const sceneContainerHelper = document.getElementById('viewHelper');
    const width = 128
    const height = 128
    clock = new THREE.Clock();
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    sceneContainerHelper.appendChild(renderer.domElement);
    viewhelper = new ViewHelper(camera, renderer.domElement);
    viewhelper.controls = orbitcontrols;
    viewhelper.controls.cennter = orbitcontrols.target;
    sceneContainerHelper.addEventListener('pointerup', (event) => viewhelper.handleClick(event));
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if(viewhelper.animating) viewhelper.update(delta);
    viewhelper.render(renderer);
}

export { initViewHelper }