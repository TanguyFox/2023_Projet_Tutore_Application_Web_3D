import * as THREE from "three";
import {gridHelper, renderer, scene, transformControls} from "../vue/Scene3D";
import {XRControllerModelFactory} from "three/addons";
import {VRButton} from "three/addons/webxr/VRButton.js";
import * as Scene3D from "../vue/Scene3D";
import * as Generaux from "../tool/Element3DGeneraux";
import {ModificationMod} from "../controleurs/Scene3DControleur";
import * as SecondScene from "../vue/SecondScene";
import {executeRenderHelper} from "../vue/viewhelper";
import * as Element3DGeneraux from "../tool/Element3DGeneraux";
import { SkyGeometry } from 'three/addons/misc/RollerCoaster.js';
import floor_texture from "../../public/resources/texture/floor_texture.png";
import {removeBoundingBox} from "../vue/BoundingBoxHandler";


let controller1, controller2; // controller1 = main gauche, controller2 = main droite
let controllerGrip1, controllerGrip2;

let INTERSECTION, VR_Button, floor, marker, raycaster, baseReferenceSpace;
const tempMatrix = new THREE.Matrix4();
let isMoving = false;
let controller_pressed = null;


/**
 * Méthode initialisant le mode réalité virtuelle
 */
function initVR(){

    VR_Button = VRButton.createButton( renderer ); // Bouton pour activer la VR
    document.getElementById("VR_mode").appendChild(VR_Button);

    renderer.xr.addEventListener('sessionstart', initialisation); // Initialisation de la scène en VR
}

/**
 * Méthode initialisant la scène en VR
 */
function initialisation(){

    removeBoundingBox(Generaux.boundingBoxObject);
    transformControls.detach();

    baseReferenceSpace = renderer.xr.getReferenceSpace();
    raycaster = new THREE.Raycaster();

    scene.remove(gridHelper);

    // Lumière
    const skylight = new THREE.HemisphereLight( 0xfff0f0, 0x60606, 3 );
    skylight.position.set( 1, 1, 1 );
    scene.add( skylight );

    //Nuage
    const cloudGeometry = new SkyGeometry();
    const cloudMaterial = new THREE.MeshBasicMaterial( { color:0xffffff });
    const cloudMesh = new THREE.Mesh( cloudGeometry, cloudMaterial );
    scene.add( cloudMesh );

    //couleur du ciel
    scene.background = new THREE.Color( 0xf0f0ff );

    // Marker montrant l'endroit où l'utilisateur veut se téléporter
    marker = new THREE.Mesh(
        new THREE.CircleGeometry( 0.25, 32 ).rotateX( - Math.PI / 2 ),
        new THREE.MeshBasicMaterial( { color: 0xbcbcbc } )
    );
    marker.position.y += 0.05;
    scene.add(marker);


    let meshBoundingBox = new THREE.Box3().setFromObject(Element3DGeneraux.group);
    Element3DGeneraux.group.position.y += -meshBoundingBox.min.y;
    Element3DGeneraux.group.position.z += -meshBoundingBox.min.z - 2;


    const textureLoader = new THREE.TextureLoader();

    // Sol
    const floorTexture = textureLoader.load(floor_texture);
    floorTexture.magFilter = THREE.NearestFilter;
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;

    // La texture est répétée 1024 fois dans chaque direction
    floorTexture.repeat.set(1024, 1024);

    const floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        transparent: true,
        opacity: 1
    });

    floor = new THREE.Mesh(
        new THREE.PlaneGeometry( 1024,
            1024,
            1,
            1).rotateX(-Math.PI/2),
        floorMaterial
    )

    floor.position.y = 0;
    scene.add(floor);


    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', () => {
        controller_pressed = controller1;
        isMoving = true;
    });
    controller1.addEventListener('selectend', () => {
        isMoving = false;
    });
    controller1.addEventListener('squeezestart', onSelectStart);
    controller1.addEventListener('squeezeend', onSelectEnd);
    controller1.addEventListener('connected', function (event) {
        this.add(buildController(event.data));
    });
    controller1.addEventListener('disconnected', function () {
        this.remove( this.children[ 0 ] );
    } );
    scene.add(controller1);



    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', () => {
        controller_pressed = controller2;
        isMoving = true;

    });
    controller2.addEventListener('selectend', () => {
        isMoving = false;
    });
    controller2.addEventListener('squeezestart', onSelectStart);
    controller2.addEventListener('squeezeend', onSelectEnd);
    controller2.addEventListener('connected', function (event) {
        this.add(buildLineTrace(event.data));
    });
    controller2.addEventListener('disconnected', function () {
        this.remove(this.children[0]);
    });
    scene.add(controller2);


    // On ajoute les modèles des contrôleurs dans la scène VR
    let controllerModelFactory = new XRControllerModelFactory();
    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
}

/**
 * Méthode permettant de se déplacer en VR
 * @param controller - Contrôleur utilisé
 * @param speed - Vitesse de déplacement
 */
function moveAlongRay(controller, speed) {
    if(!isMoving) return;
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(controller.quaternion).normalize(); // Direction du rayon
    const offsetPosition = direction.multiplyScalar(speed);
    const offsetPositionXR = { x: -offsetPosition.x, y: -offsetPosition.y, z: -offsetPosition.z, w: 1 };
    const offsetRotation = new THREE.Quaternion();
    //ignore error - ça fonctionne dans le navigateur
    const transform = new XRRigidTransform(offsetPositionXR, offsetRotation);
    const teleportSpaceOffset = renderer.xr.getReferenceSpace().getOffsetReferenceSpace(transform);
    renderer.xr.setReferenceSpace(teleportSpaceOffset);
}

/**
 * Méthode permettant de créer un trait pour le contrôleur
 * montrant la direction du rayon
 * @param data
 * @returns {Line}
 */

function buildLineTrace(data){
    let geometry = new THREE.BufferGeometry(); // Géométrie du trait
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) ); // Position du trait
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) ); // Couleur du trait
    let material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } ); // Matériau du trait
    return new THREE.Line( geometry, material ); // Création du trait
}

/**
 * Méthode permettant de créer un contrôleur
 * @param data
 * @returns {Line|Mesh}
 */
function buildController( data ) {
    let geometry, material;
    switch ( data.targetRayMode ) {
        case 'tracked-pointer':
            geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
            material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
            return new THREE.Line( geometry, material );
        case 'gaze':
            geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );
    }
}

/**
 * Méthode permettant de définir la fin de la sélection et de se téléporter
 */
function onSelectEnd() {
    this.userData.isSelecting = false;
    if ( INTERSECTION ) {
        const offsetPosition = { x: - INTERSECTION.x, y: - INTERSECTION.y, z: - INTERSECTION.z, w: 1 };
        const offsetRotation = new THREE.Quaternion();
        const transform = new XRRigidTransform( offsetPosition, offsetRotation );
        const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace( transform );
        renderer.xr.setReferenceSpace( teleportSpaceOffset );
    }
}

function onSelectStart() {
    this.userData.isSelecting = true;
}

/**
 * Méthode permettant de rendre le marker visible
 */
function vrRenderSelect(){
    INTERSECTION = undefined;

    if ( controller1.userData.isSelecting === true ) {

        tempMatrix.identity().extractRotation(controller1.matrixWorld); // On récupère la rotation du contrôleur

        raycaster.ray.origin.setFromMatrixPosition(controller1.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix); // On définit la direction du rayon

        const intersects = raycaster.intersectObjects([floor]);

        if (intersects.length > 0) {
            INTERSECTION = intersects[0].point;
        }

    }else if ( controller2.userData.isSelecting === true ) {
        tempMatrix.identity().extractRotation(controller2.matrixWorld);

        raycaster.ray.origin.setFromMatrixPosition(controller2.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycaster.intersectObjects([floor]);

        if (intersects.length > 0) {
            INTERSECTION = intersects[0].point;
        }
    }

    if (INTERSECTION) marker.position.copy(INTERSECTION); // On déplace le marker à l'endroit où l'utilisateur veut se téléporter
    marker.position.y += 0.05;
    marker.visible = INTERSECTION !== undefined;

}

/**
 * Méthode permettant de rendre la scène en VR interactive
 */
function animate_VR(){
    renderer.setAnimationLoop( function () {
        Scene3D.orbitcontrols.update();

        if(Generaux.boundingBoxObject.boundingBox){
            Generaux.boundingBoxObject.boundingBox.update();
        }

        if(renderer.xr.isPresenting){
            vrRenderSelect(); // On rend le marker visible

            if(isMoving){
                moveAlongRay(controller_pressed, 0.045); // On se déplace
            }

        }

        if(ModificationMod){
            Scene3D.renderer.render(Scene3D.scene, Scene3D.camera);
        }else{
            Scene3D.renderer.render(SecondScene.scene, Scene3D.camera);
        }

        executeRenderHelper();
    });
}


export {
    initVR,
    vrRenderSelect,
    animate_VR
}