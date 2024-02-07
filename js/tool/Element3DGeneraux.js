/**
 * module répertoriant tous les éléments de l'objet 3D susceptibles d'être utilisés dans d'autres
 * modules et nécessitant une seule instance
 */
import * as THREE from "three";
import {wireframe} from "../controleurs/ImportSTLfileEvent";
import * as SecondScene from "../vue/SecondScene";
import {HalfEdge} from "../structure/HalfEdge";
import {Face} from "../structure/Face";


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

function removeErrors() {
    group.children.splice(3, group.children.length - 2);
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


export function createTriangle(v1, v2, v3){
    //create triangle
    let triangle = new THREE.BufferGeometry();

    //vertices tab counterclockwise
    let vertices = new Float32Array([
        v1.point.x, v1.point.y, v1.point.z,
        v2.point.x, v2.point.y, v2.point.z,
        v3.point.x, v3.point.y, v3.point.z
    ]);

    triangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    let material = new THREE.MeshBasicMaterial({color: "rgb(255,104,0)", opacity: 0.5, transparent: true});

    updateStructure(v1, v2, v3)

    return new THREE.Mesh(triangle, material);

}

export function createCylinder(edge) {

    geometry_model.computeBoundingSphere();

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

export function isCounterClockwise(point1, point2, point3) {
    let v1 = new THREE.Vector3().subVectors(point2, point1);
    let v2 = new THREE.Vector3().subVectors(point3, point1);

    let crossVector = new THREE.Vector3().crossVectors(v1, v2);

    return crossVector.z > 0;
}

function updateStructure(v1, v2, v3) {
    let edge1 = new HalfEdge(v1);
    let edge2 = new HalfEdge(v2);
    let edge3 = new HalfEdge(v3);

    let halfedges = [edge1, edge2, edge3];
    halfedges.forEach((edge, index) => {
        edge.next = halfedges[(index + 1) % 3];
        edge.prev = halfedges[(index + 2) % 3];

        edge.face = new Face(edge);
    })

    v1.addHalfEdge(edge1);
    v2.addHalfEdge(edge2);
    v3.addHalfEdge(edge3);

    if (!edge1.opposite) {
        mesh.boundaryEdges.push(edge1);
    }

    if (!edge2.opposite) {
        mesh.boundaryEdges.push(edge2);
    }

    if (!edge3.opposite) {
        mesh.boundaryEdges.push(edge3);
    }
    mesh.faces.push(edge1.face);
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
    groupAsPlain,
    removeErrors
}