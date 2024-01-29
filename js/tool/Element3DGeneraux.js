/**
 * module répertoriant tous les éléments de l'objet 3D susceptibles d'être utilisés dans d'autres
 * modules et nécessitant une seule instance
 */
import * as THREE from "three";
import {wireframe} from "../controleurs/ImportSTLfileEvent";
import * as SecondScene from "../vue/SecondScene";


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

        //Deuxième scène
        SecondScene.setGroup(new THREE.Group());
        SecondScene.setMeshModel(new THREE.Mesh(geometry_model.clone(), wireframeMaterial));
        SecondScene.group.add(SecondScene.meshModel);
    } else {
        meshModel.material = wireframeMaterial;

        //Deuxième scène
        SecondScene.meshModel.material = wireframeMaterial;
    }
    setLineModel(new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x000000})));
    group.add(lineModel);

    //Deuxième scène
    SecondScene.setLineModel(new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x000000})));
    SecondScene.group.add(SecondScene.lineModel);
}

function groupAsPlain() {
    meshModel.material =  plainMaterial;
    group.remove(lineModel);

    //Deuxième scène
    SecondScene.meshModel.material = plainMaterial;
    SecondScene.group.remove(SecondScene.lineModel);
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


export function createTriangle(edge1, edge2){
    //create triangle
    let triangle = new THREE.BufferGeometry();
    //vertices tab counterclockwise
    let vertices = new Float32Array([
        edge2.tailVertex().point.x, edge2.tailVertex().point.y, edge2.tailVertex().point.z,
        edge1.tailVertex().point.x, edge1.tailVertex().point.y, edge1.tailVertex().point.z,
        edge1.headVertex().point.x, edge1.headVertex().point.y, edge1.headVertex().point.z
    ]);

    triangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    let material = new THREE.MeshBasicMaterial({color: "rgb(255,104,0)"});
    triangle.computeVertexNormals();

    return new THREE.Mesh(triangle, material);

}

export function createCylinder(edge) {
    //set height of cylinder equals to the distance between the two vertices
    let height = edge.headVertex().point.distance(edge.tailVertex().point);
    //adapt radius to the size of the mesh
    let radius = geometry_model.boundingSphere.radius > 2 ? geometry_model.boundingSphere.radius / 500 : 0.01;

    //create cylinder
    let cylinder = new THREE.CylinderGeometry(radius, radius, height, 32);
    let material = new THREE.MeshBasicMaterial({color: "rgb(255, 0, 0)"});
    let cylinderMesh = new THREE.Mesh(cylinder, material);

    //align cylinder on edge
    let center = new THREE.Vector3();
    center.addVectors(edge.headVertex().point, edge.tailVertex().point);
    center.divideScalar(2);
    cylinderMesh.position.set(center.x, center.y, center.z);
    let direction = new THREE.Vector3();
    direction.subVectors(edge.headVertex().point, edge.tailVertex().point);
    cylinderMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

    return cylinderMesh;
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