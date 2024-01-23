/**
 * module répertoriant tous les éléments de l'objet 3D susceptibles d'être utilisés dans d'autres
 * modules et nécessitant une seule instance
 */
import * as THREE from "three";
import {wireframe} from "../controleurs/ImportSTLfileEvent";
import * as Scene3D from "../vue/Scene3D";


//STL file
let meshModel;
//Geometry
let geometry_model = null;

//couleur de mesh
let color_mesh;

//wireframe
let lineModel;
//mesh + wireframe
let group;
//Bounding Box
let boundingBoxObject = {
    boundingBox: null
};

let plainMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(205,179,179)"), specular: new THREE.Color("rgb(230,145,56)"), shininess: 200});
let wireframeMaterial = new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, opacity: 0.65});

//Maillage en données
let mesh;

let faceIndexSelected;
let faceIndexAncien;

function setGeometryModel(geometry){
    geometry_model = geometry;
}

function setColorMesh(colorMesh){
    color_mesh = colorMesh;
}

function setLineModel(lineModelsetter){
    lineModel = lineModelsetter;
}

function setMeshModel(meshModelSetter){
    meshModel = meshModelSetter
}

function setGroup(groupsetter){
    group = groupsetter;
}

function groupAsWireframe() {
    if (!group) {
        group = new THREE.Group();
        setMeshModel(new THREE.Mesh(geometry_model, wireframeMaterial));
        group.add(meshModel);
    } else {
        meshModel.material = wireframeMaterial;
    }
    setLineModel(new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x000000})));
    group.add(lineModel);
}

function groupAsPlain() {
    meshModel.material =  plainMaterial;
    group.remove(lineModel);
}

function setFaceIndexSelected(valeur){
    faceIndexSelected=valeur;
}
function setFaceIndexAncien(valeur){
    faceIndexAncien=valeur;
}

function setMesh(newMesh){
    mesh=newMesh;
}
export {
    geometry_model,
    color_mesh,
    lineModel,
    group,
    meshModel,
    boundingBoxObject,
    faceIndexSelected,
    faceIndexAncien,
    mesh,
    plainMaterial,
    wireframeMaterial,
    setGeometryModel,
    setColorMesh,
    setLineModel,
    setMeshModel,
    setGroup,
    setFaceIndexSelected,
    setFaceIndexAncien,
    setMesh,
    groupAsWireframe,
    groupAsPlain
}