import * as THREE from "three";
import {camera, cameraGroup, renderer, scene} from "../vue/Scene3D";
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
        cameraGroup.add(controllerGrip1);

        let controllerGrip2 = renderer.xr.getControllerGrip(1);
        controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
        cameraGroup.add(controllerGrip2);

        controllers.controller1.addEventListener('selectstart', () => {
            updateCameraPosition(controllers.controller1);

        });

        controllers.controller2.addEventListener('selectstart', () => {
            updateCameraPosition(controllers.controller2);
        });

    });
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
    let distance = 5;
    let moveDirection = controllerDirection.multiplyScalar(distance);
    cameraGroup.position.add(moveDirection);
}

export {
    initVR,
}