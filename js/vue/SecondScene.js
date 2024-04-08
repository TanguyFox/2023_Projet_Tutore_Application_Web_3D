import * as THREE from "three";

let scene = new THREE.Scene(); // scene de visualisation

let group; // groupe de mesh

let meshModel; // Objet 3D

let lineModel; // Maillage de l'objet 3D

scene.background = new THREE.Color(0x888888);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

/**
 * Fonction qui permet de définir l'objet 3D à visualiser
 * @param meshM
 */
function setMeshModel(meshM){
    meshModel = meshM;
}

/**
 * Fonction qui permet de définir le maillage de l'objet 3D à visualiser
 * @param lineM
 */
function setLineModel(lineM){
    lineModel = lineM;
}

/**
 * Fonction qui permet de définir le groupe de mesh à visualiser
 * @param groups
 */
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