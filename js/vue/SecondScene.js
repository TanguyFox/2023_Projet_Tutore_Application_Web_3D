import * as THREE from "three";

let scene = new THREE.Scene();

let group;

let meshModel;

let lineModel;

scene.background = new THREE.Color(0x888888);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

function setMeshModel(meshM){
    meshModel = meshM;
}

function setLineModel(lineM){
    lineModel = lineM;
}

function setGroup(groups){
    group = groups;
}

export{
    scene,
    setLineModel,
    setMeshModel,
    group,
    meshModel,
    lineModel,
    setGroup
}