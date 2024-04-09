import {STLLoader} from 'three/addons/loaders/STLLoader.js'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import * as THREE from "three";
import {initViewHelper} from "./viewhelper";
import {onPointerMove} from "../fonctionnalites/SelectionFace";
import {onDoubleClick, onPointerClick} from "../controleurs/Scene3DControleur";
import {deplacerPoint, mouseUpReinitialisation, setMouseClick} from "../fonctionnalites/ModifCoordPoint";
import {appearMenuContextuel} from "./MenuContextuel";
import * as VR from "../fonctionnalites/VR.js"
import {animate_VR} from "../fonctionnalites/VR.js";

/**
 * Module gérant la scène 3D
 */

//attributs
let renderer; // Element qui va afficher la scène (utilise WebGL)
let sceneContrainer; // div contenant la scène
let scene; // Scene 3D de Threejs
let camera; // Camera de la scène
let gridHelper; // Grille de la scène
let transformControls; // Element permettant les actions de rotation / translation / scale sur l'objet 3D
let orbitcontrols; // Element permettant de bouger la caméra autour de l'objet 3D

//Taille de la fenêtre
let widthS = window.innerWidth;
let heightS = window.innerHeight;

//Camera Group - VR
let cameraGroup = new THREE.Group();

//fonction de création de la scène 3D
function initScene3D() {
console.log("initScene3D")

//Scene
//------------------------------------------
    sceneContrainer = document.getElementById('scene-container');
    scene = new THREE.Scene();

//Scene backgroud
    scene.background = new THREE.Color(0x888888);
//------------------------------------------

//Camera
//------------------------------------------
    camera = new THREE.PerspectiveCamera(75, widthS / heightS, 0.1, 1000); //75° de vision, ratio de l'écran, distance de vue min, distance de vue max
//------------------------------------------

//Renderer {antialias: false} pour améliorer la performance, le changer si besoins
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.xr.enabled = true; // VR
    renderer.setSize(widthS, heightS);

    VR.initVR(); // Lance le mode VR

    cameraGroup.add(camera);
    scene.add(cameraGroup);

    sceneContrainer.appendChild(renderer.domElement); // Ajout de la scène dans le conteneur

//Lumière d'ambiance de la scène
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

//Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

//Grid
    gridHelper = new THREE.GridHelper(20, 20);
    gridHelper.position.set(0, 0, 0);
    gridHelper.material.color.set(0x000000);
    scene.add(gridHelper);

    //Camera Control
    orbitcontrols = new OrbitControls(camera, renderer.domElement);


//fonction deplacement
    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', function (event) {
        orbitcontrols.enabled = !event.value;
    });
    console.log(transformControls);
    scene.add(transformControls);

    //Création du repère 3D
    initViewHelper();

    return renderer;
}

//Fonction de reconstruction de la scène 3D
function rebuildAll(antialiasStat){
    scene.remove(transformControls);
    renderer.domElement.remove();


    let oldEtat_OrbitControls = orbitcontrols.target;
    let objetAttach = transformControls.object;

    //Eviter fuite de mémoire
    transformControls.dispose();
    orbitcontrols.dispose();
    renderer.dispose();
    renderer.forceContextLoss();

    renderer = new THREE.WebGLRenderer({antialias: antialiasStat});
    renderer.xr.enabled = true;

    document.getElementById("VR_mode").firstChild.remove();
    VR.initVR();

    renderer.setSize(widthS, heightS);

    sceneContrainer.appendChild(renderer.domElement);

    //VR
    animate_VR();

    orbitcontrols = new OrbitControls(camera, renderer.domElement);
    orbitcontrols.target = oldEtat_OrbitControls;
    orbitcontrols.update();

    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', function (event) {
        orbitcontrols.enabled = !event.value;
    });

    scene.add(transformControls);

    if(objetAttach != null){
        transformControls.attach(objetAttach);
    }

    renderer.domElement.addEventListener('mousemove', onPointerMove, false);
    renderer.domElement.addEventListener('mousedown', onPointerClick);
    renderer.domElement.addEventListener('dblclick', onDoubleClick, false);
    renderer.domElement.addEventListener('click', setMouseClick);
    renderer.domElement.addEventListener('mousemove', deplacerPoint);
    renderer.domElement.addEventListener('mouseup', mouseUpReinitialisation);
    renderer.domElement.addEventListener('contextmenu', appearMenuContextuel);
}

//Fonction de changement de la taille de la fenêtre
function setWidth_Height(width, height) {
    widthS = width;
    heightS = height;
}


export {
    initScene3D,
    renderer,
    scene,
    sceneContrainer,
    camera,
    gridHelper,
    transformControls,
    orbitcontrols,
    widthS,
    heightS,
    rebuildAll,
    setWidth_Height,
    cameraGroup,
}