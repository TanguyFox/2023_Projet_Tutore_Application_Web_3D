import * as THREE from "three";
import {camera, cameraGroup, gridHelper, renderer, scene} from "../vue/Scene3D";
import {XRControllerModelFactory} from "three/addons";
import {VRButton} from "three/addons/webxr/VRButton.js";
import {lineModel, meshModel} from "../tool/Element3DGeneraux";
import * as Scene3D from "../vue/Scene3D";
import * as Generaux from "../tool/Element3DGeneraux";
import {ModificationMod} from "../controleurs/Scene3DControleur";
import * as SecondScene from "../vue/Scene3D";
import {executeRenderHelper} from "../vue/viewhelper";
import * as Element3DGeneraux from "../tool/Element3DGeneraux";
import { TreesGeometry, SkyGeometry } from 'three/addons/misc/RollerCoaster.js';
import wood_texture from "../../resources/texture/wood_texture.png";

let controller1, controller2;
let controllerGrip1, controllerGrip2;

let INTERSECTION, VR_Button, floor, marker, raycaster, baseReferenceSpace;
const tempMatrix = new THREE.Matrix4();

function initVR(){

    VR_Button = VRButton.createButton( renderer );
    document.getElementById("VR_mode").appendChild(VR_Button);

    renderer.xr.addEventListener('sessionstart', initialisation);
}

function initialisation(){

    baseReferenceSpace = renderer.xr.getReferenceSpace();
    raycaster = new THREE.Raycaster();

    scene.remove(gridHelper);

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

    marker = new THREE.Mesh(
        new THREE.CircleGeometry( 0.25, 32 ).rotateX( - Math.PI / 2 ),
        new THREE.MeshBasicMaterial( { color: 0xbcbcbc } )
    );
    scene.add(marker);


    let meshBoundingBox = new THREE.Box3().setFromObject(Element3DGeneraux.group);
    Element3DGeneraux.group.position.y += -meshBoundingBox.min.y;
    Element3DGeneraux.group.position.z += -meshBoundingBox.min.z - 2;


    const textureLoader = new THREE.TextureLoader();

    //Can't find path
    const woodTexture = textureLoader.load( wood_texture );
    const floorMaterial = new THREE.MeshBasicMaterial({
        map: woodTexture,
        transparent: true,
        opacity: 1
    });

    floor = new THREE.Mesh(
        new THREE.PlaneGeometry( meshBoundingBox.max.x - meshBoundingBox.min.x + 10,
            meshBoundingBox.max.z - meshBoundingBox.min.z + 10,
            2,
            2).rotateX(-Math.PI/2),
        floorMaterial
    )

    floor.position.x = meshModel.position.x;
    floor.position.z = meshModel.position.z;
    floor.position.y = 0;
    scene.add(floor);


    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    controller1.addEventListener('connected', function (event) {
        this.add(buildController(event.data));
    });
    controller1.addEventListener('disconnected', function () {
        this.remove( this.children[ 0 ] );
    } );
    scene.add(controller1);


    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', () => {
        moveAlongRay(controller2, 3);
    });
    controller2.addEventListener('connected', function (event) {
        this.add(buildLineTrace(event.data));
    });
    controller2.addEventListener('disconnected', function () {
        this.remove(this.children[0]);
    });
    scene.add(controller2);


    let controllerModelFactory = new XRControllerModelFactory();
    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
}

function moveAlongRay(controller, distance) {
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(controller.quaternion).normalize();
    const offsetPosition = direction.multiplyScalar(distance);
    const offsetPositionXR = { x: -offsetPosition.x, y: -offsetPosition.y, z: -offsetPosition.z, w: 1 };
    const offsetRotation = new THREE.Quaternion();
    //ignore error - ça fonctionne dans le navigateur
    const transform = new XRRigidTransform(offsetPositionXR, offsetRotation);
    const teleportSpaceOffset = renderer.xr.getReferenceSpace().getOffsetReferenceSpace(transform);
    renderer.xr.setReferenceSpace(teleportSpaceOffset);
}


function buildLineTrace(data){
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
    let material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
    return new THREE.Line( geometry, material );
}

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



//Error ! 
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

function vrRenderSelect(){
    INTERSECTION = undefined;

    if ( controller1.userData.isSelecting === true ) {

        tempMatrix.identity().extractRotation(controller1.matrixWorld);

        raycaster.ray.origin.setFromMatrixPosition(controller1.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycaster.intersectObjects([floor]);

        if (intersects.length > 0) {
            INTERSECTION = intersects[0].point;
        }

        if (INTERSECTION) marker.position.copy(INTERSECTION);

        marker.visible = INTERSECTION !== undefined;
    }
}

//VR
function animate_VR(){
    renderer.setAnimationLoop( function () {
        Scene3D.orbitcontrols.update();

        if(Generaux.boundingBoxObject.boundingBox){
            Generaux.boundingBoxObject.boundingBox.update();
        }

        if(renderer.xr.isPresenting){
            vrRenderSelect();
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