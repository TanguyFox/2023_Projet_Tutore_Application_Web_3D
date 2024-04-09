/**
 * module répertoriant tous les éléments de l'objet 3D susceptibles d'être utilisés dans d'autres
 * modules et nécessitant une seule instance
 */
import * as THREE from "three";
import {wireframe} from "../controleurs/ImportSTLfileEvent";
import * as SecondScene from "../vue/SecondScene";
import {HalfEdge} from "../structure/HalfEdge";
import {Face} from "../structure/Face";
import {Problems} from "../structure/Problems";


//STL file
let meshModel; // Mesh de l'objet 3D
//Geometry
let geometry_model = null; // Géométrie de l'objet 3D

//couleur de mesh
let color_mesh; // Couleur du mesh

//wireframe
let lineModel; // Ligne du wireframe

let group; // Groupe des éléments de l'objet 3D
//Bounding Box

let boundingBoxObject = {
    boundingBox: null
};

// Matériau utilisé pour un affichage en couleur unie (comme il sera imprimé)
let plainMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(205,179,179)"), specular: new THREE.Color("rgb(230,145,56)"), shininess: 200});

// Matériau utilisé pour un afficher le maillage de l'objet 3D
let wireframeMaterial = new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, opacity: 0.65});

let mesh; // Données du mailage de l'objet 3D

let meshProblems; // Problèmes du maillage de l'objet 3D

let faceIndexSelected; // Index de la face sélectionnée
let faceIndexAncien; // Index de la face précédemment sélectionnée

/**
 * Fonction permettant de définir la géométrie de l'objet 3D
 * @param geometry
 */
function setGeometryModel(geometry){
    geometry_model = geometry;
}


/**
 * Fonction permettant de définir la couleur du mesh
 * @param colorMesh
 */
function setColorMesh(colorMesh){
    color_mesh = colorMesh;
}

/**
 * Fonction permettant de définir le modèle de ligne
 * @param lineModelsetter
 */
function setLineModel(lineModelsetter){
    lineModel = lineModelsetter;
}

/**
 * Fonction permettant de définir l'ojet 3D dans la scène
 * @param meshModelSetter
 */
function setMeshModel(meshModelSetter){
    meshModel = meshModelSetter
}

/**
 * Fonction permettant de définir le groupe des éléments de l'objet 3D
 * @param groupsetter
 */
function setGroup(groupsetter){
    group = groupsetter;
}

/**
 * Fonction permettant de définir la version wireframe de l'objet 3D
 */
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

/**
 * Fonction permettant de définir la version impression de l'objet 3D
 */
function groupAsPlain() {
    meshModel.material =  plainMaterial;
    group.remove(lineModel);

    //Deuxième scène
    SecondScene.meshModel.material = plainMaterial;
    SecondScene.group.remove(SecondScene.lineModel);
}

/**
 * Fonction permettant les éléments mettant en évidence les erreurs de maillage
 */

function removeErrors() {
    group.children.splice(3, group.children.length - 2);
}

/**
 * Fonction permettant de définir l'index de la face sélectionnée
 * @param valeur
 */
function setFaceIndexSelected(valeur){
    faceIndexSelected=valeur;
}

/**
 * Fonction permettant de définir l'index de la face précédemment sélectionnée
 * @param valeur
 */
function setFaceIndexAncien(valeur){
    faceIndexAncien=valeur;
}

/**
 * Fonction permettant de définir les données du maillage de l'objet 3D
 * @param newMesh
 */
function setMesh(newMesh){
    mesh=newMesh;
}

/**
 * Fonction permettant de définir les problèmes du maillage de l'objet 3D
 * @param boundaryEdges - tableau des arrêtes sans opposées
 */
function setMeshProblems(boundaryEdges){
    meshProblems=new Problems(boundaryEdges);
}

/**
 * Fonction permettant de créer un triangle
 * @param v1 - sommet 1
 * @param v2 - sommet 2
 * @param v3 - sommet 3
 * @returns {Mesh}
 */
export function createTriangle(v1, v2, v3){
    //create triangle
    let triangle = new THREE.BufferGeometry();

    //vertices tab counterclockwise
    let vertices = new Float32Array([
        v1.point.x, v1.point.y, v1.point.z,
        v2.point.x, v2.point.y, v2.point.z,
        v3.point.x, v3.point.y, v3.point.z
    ]);

    triangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // Position du triangle (d'après les sommets)
    let material = new THREE.MeshBasicMaterial({color: "rgb(255,104,0)", opacity: 0.5, transparent: true});

    updateStructure(v1, v2, v3) // Mise à jour de la structure de données avec les nouveaux sommets

    return new THREE.Mesh(triangle, material);

}

/**
 * Fonction permettant de créer un cylindre
 * Utilisé pour mettre en évidence les arêtes du maillage sans opposées
 * @param edge - arête
 * @returns {Mesh|Mesh}
 */
export function createCylinder(edge) {

    geometry_model.computeBoundingSphere(); // Calcul de la sphère englobante de la géométrie

    //Hauteur du cylindre = distance entre les deux sommets de l'arête
    let height = edge.headVertex().point.distance(edge.tailVertex().point);

    //Rayon du cylindre dépend du rayon de la sphère englobante
    let radius = geometry_model.boundingSphere.radius > 2 ? geometry_model.boundingSphere.radius / 500 : 0.01;

    //Création du cylindre
    let cylinder = new THREE.CylinderGeometry(radius, radius, height, 32);
    let material = new THREE.MeshBasicMaterial({color: "rgb(255, 0, 0)"});
    let cylinderMesh = new THREE.Mesh(cylinder, material);

    //On positionne le cylindre sur l'arête
    let center = new THREE.Vector3();
    center.addVectors(edge.headVertex().point, edge.tailVertex().point); // Centre du cylindre = longueur de l'arête / 2
    center.divideScalar(2);
    cylinderMesh.position.set(center.x, center.y, center.z); // Position du cylindre = centre de l'arête
    let direction = new THREE.Vector3();
    direction.subVectors(edge.headVertex().point, edge.tailVertex().point); // Direction du cylindre = vecteur entre les deux sommets
    cylinderMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()); // Rotation du cylindre

    return cylinderMesh;
}

/**
 * INUTILISEE
 * Fonction vérifiant si trois points sont dans le sens trigonométrique
 * @param point1
 * @param point2
 * @param point3
 * @returns {boolean}
 */
export function isCounterClockwise(point1, point2, point3) {
    let v1 = new THREE.Vector3().subVectors(point2, point1);
    let v2 = new THREE.Vector3().subVectors(point3, point1);

    let crossVector = new THREE.Vector3().crossVectors(v1, v2);

    return crossVector.z > 0;
}

/**
 * Fonction permettant de mettre à jour la structure de données du maillage
 * On crée trois arêtes et trois faces à partir des trois sommets
 * On ajoute les arêtes aux sommets et on ajoute les faces aux arêtes
 * On ajoute les arêtes sans opposées aux problèmes du maillage
 * @param v1
 * @param v2
 * @param v3
 */
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
        meshProblems.boundaryEdges.push(edge1);
    }

    if (!edge2.opposite) {
        meshProblems.boundaryEdges.push(edge2);
    }

    if (!edge3.opposite) {
        meshProblems.boundaryEdges.push(edge3);
    }
    meshProblems.newFaces.push(edge1.face);
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
    meshProblems,
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
    setMeshProblems,
    groupAsWireframe,
    groupAsPlain,
    removeErrors
}