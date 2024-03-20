import * as THREE from "three";
import {renderer, scene} from "../vue/Scene3D";
import {XRControllerModelFactory} from "three/addons";
import {VRButton} from "three/addons/webxr/VRButton.js";


let controllers = {
    "controller1":null,
    "controller2":null
}


let VR_Button;

function initVR(){
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
            moveAlongRay(controllers.controller1, 1)
        });

        controllers.controller2.addEventListener('selectstart', () => {
            moveAlongRay(controllers.controller2, 1)

        });

        controllers.controller1.addEventListener('connected', function (event) {
           this.add(buildLineTrace());
        });

        controllers.controller2.addEventListener('connected', function (event) {
            this.add(buildLineTrace());
        });

        controllers.controller1.addEventListener('disconnected', function () {
            this.remove(this.children[0]);
        });

        controllers.controller1.addEventListener('disconnected', function () {
            this.remove(this.children[0]);
        });

    });
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


function buildLineTrace(){
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
    let material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
    return new THREE.Line( geometry, material );
}


export {
    initVR,
}