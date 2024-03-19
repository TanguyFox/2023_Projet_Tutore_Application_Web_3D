import {STLLoader} from 'three/addons/loaders/STLLoader.js'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import {createBoundingBox, removeBoundingBox} from "./BoundingBoxHandler.js";
import * as THREE from "three";
import {initViewHelper} from "./viewhelper";
import {onPointerMove} from "../fonctionnalites/SelectionFace";
import {animate_VR, onDoubleClick, onPointerClick} from "../controleurs/Scene3DControleur";
import {deplacerPoint, mouseUpReinitialisation, setMouseClick} from "../fonctionnalites/ModifCoordPoint";
import {mesh} from "../tool/Element3DGeneraux";
import {initEventInputCoord} from "../controleurs/ModificationMenu";
import {appearMenuContextuel} from "./MenuContextuel";
import {VRButton} from "three/addons/webxr/VRButton";
import {XRControllerModelFactory} from "three/addons";


/**
 * Affichage de l'objet 3D
 */

//attributs
let renderer;
let sceneContrainer;
let scene;
let camera;
let gridHelper;
let transformControls;
let orbitcontrols;

//width / height Scene / a modifier temps en temps pour la Précision de RayCaster
let widthS = window.innerWidth;
let heightS = window.innerHeight;

//Camera Group - VR
let cameraGroup = new THREE.Group();

let controllers = {
    "controller1":null,
    "controller2":null
}


let VR_Button;

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
    camera = new THREE.PerspectiveCamera(75, widthS / heightS, 0.1, 1000);
//------------------------------------------

//Renderer {antialias: false} pour améliorer la performance, le change selon les besoins
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.xr.enabled = true;
    renderer.setSize(widthS, heightS);

    // -- VR
    VR_Button = VRButton.createButton( renderer );
    document.getElementById("VR_mode").appendChild(VR_Button);


    VR_Button.addEventListener('click', function () {
        controllers.controller1 = renderer.xr.getController(0);
        controllers.controller2 = renderer.xr.getController(1);
        scene.add(controllers.controller1);
        scene.add(controllers.controller2);

        let controllerModelFactory = new XRControllerModelFactory();
        let controllerGrip1 = renderer.xr.getControllerGrip(0);
        controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
        scene.add(controllerGrip1);

        let controllerGrip2 = renderer.xr.getControllerGrip(1);
        controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
        scene.add(controllerGrip2);

        controllers.controller1.addEventListener('selectstart', () => {
            console.log("VR SELECT");
            console.log(camera);
            moveCameraForward(2);
        });

        controllers.controller2.addEventListener('selectstart', () => {
            console.log("VR SELECT");
            console.log(camera);
            moveCameraForward(2);
        });



    });

    cameraGroup.add(camera);
    scene.add(cameraGroup);
    // -- VR

    sceneContrainer.appendChild(renderer.domElement);

//Ambient Light 0x404040
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

    //viewhelper
    initViewHelper();

    return renderer;
}

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

    document.getElementById("VR_mode").removeChild(VR_Button);
    VR_Button = VRButton.createButton( renderer );
    document.getElementById("VR_mode").appendChild(VR_Button);

    scene.remove(controllers.controller1);
    scene.remove(controllers.controller2);

    controllers.controller1 = renderer.xr.getController(0);
    controllers.controller2 = renderer.xr.getController(1);

    scene.add(controllers.controller1);
    scene.add(controllers.controller2);

    controllers.controller1.addEventListener('selectstart', () => {
        // console.log("VR SELECT");
        // console.log(camera);
        // moveCameraForward(2);
        updateCameraPosition(controllers.controller1);
    });

    controllers.controller2.addEventListener('selectstart', () => {
        // console.log("VR SELECT");
        // console.log(camera);
        // moveCameraForward(2);
        updateCameraPosition(controllers.controller2);
    });

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

function setWidth_Height(width, height) {
    widthS = width;
    heightS = height;
}

//old function
function moveCameraForward(distance) {
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    const newPosition = direction.multiplyScalar(distance).add(cameraGroup.position);
    cameraGroup.position.set(newPosition.x, newPosition.y, newPosition.z);
}

function updateCameraPosition(controller) {
    let controllerDirection = new THREE.Vector3();
    controller.getWorldDirection(controllerDirection);
    let distance = 10;
    let moveDirection = controllerDirection.multiplyScalar(distance);
    camera.position.add(moveDirection);
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
    VRButton
}