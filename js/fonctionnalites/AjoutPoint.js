import * as THREE from "three";
import {
    afficherPoints3D,
    afficherSingleCoordPoint,
    afficherSinglePoint3d,
    setTransformedPosition
} from "./SelectionFace";
import {intersects} from "../controleurs/Scene3DControleur";
import * as Generaux from "../tool/Element3DGeneraux";
import * as Scene3D from "../vue/Scene3D";
import * as Raycaster from "../tool/Raycaster";
import {int} from "three/nodes";
import {initEventInputCoord} from "../controleurs/ModificationMenu";
import {geometry_model, groupAsWireframe, mesh, meshModel} from "../tool/Element3DGeneraux";
import {Point} from "../structure/Point";
import {majEdges} from "./ModifCoordPoint";
import {camera} from "../vue/Scene3D";
import * as generaux from "../tool/Element3DGeneraux";
import {HalfEdge} from "../structure/HalfEdge";
import {Vertex} from "../structure/Vertex";
import {Face} from "../structure/Face";

/**
 * Module ajoutant un point à la structure
 */
let sphere;

/**
 * Méthode globale de l'ajout d'un point
 * @param menuContextuel
 */
export function ajoutPoint(menuContextuel) {
    removeSphere();
    ajPoint3D();
    afficherSingleCoordPoint('', sphere, sphere.position, "#ffff00");
    //initEventInputCoord();
    // remplirStructureDeDonnees(sphere.position);
    let newPoint = new Point(sphere.position.x, sphere.position.y, sphere.position.z);
    let troisPointsProches = trouver3ptsProches2(newPoint);
    //console.log(troisPointsProches);
    //supprimerAncienneFace(troisPointsProches);
    majBufferGeometry(newPoint, troisPointsProches[2], troisPointsProches[1]);
    majBufferGeometry(newPoint, troisPointsProches[1], troisPointsProches[0]);
    majBufferGeometry(newPoint, troisPointsProches[0], troisPointsProches[2]);
    geometry_model.computeBoundingSphere(); // Recalcul du sphere de la bounding box
    geometry_model.computeBoundingBox(); // Recalcul de la bounding box
    //geometry_model.computeFaceNormals(); // Recalcul des normales des faces
    geometry_model.computeVertexNormals();
    geometry_model.attributes.position.needsUpdate = true;
    meshModel.geometry = geometry_model;
    Scene3D.transformControls.detach();

    majEdges();
    initEventInputCoord();

    remplirStructureDeDonnees(newPoint, troisPointsProches);
}

/**
 * méthode ajoutant un point jaune dans le plan 3D à l'endroit du pointeur
 */
function ajPoint3D() {

    let mouse = {x: 0, y: 0};
    mouse.x = Raycaster.pointer.x;
    mouse.y = Raycaster.pointer.y;

    // Utilisez la fonction unproject pour convertir les coordonnées de l'écran en coordonnées de la scène en 3D
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);

    // Obtenez la liste des objets intersectés
    let intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);

    let isObject = false;

    // Créez une nouvelle sphère à la position du clic
    let geometry = new THREE.SphereGeometry(0.05, 16, 16);
    let material = new THREE.MeshBasicMaterial({color: 0xFFFF00});
    sphere = new THREE.Mesh(geometry, material);

    for (let i = 0; i < intersects.length; i++) {

        if (intersects[i].object.uuid === Generaux.meshModel.uuid) {
            //console.log(intersects[i]);
            isObject = true;

            sphere.position.copy(intersects[i].point);
            break;
        }
    }

    if (!isObject) {
        Generaux.meshModel.geometry.computeBoundingBox();
        let localCenter = new THREE.Vector3();
        Generaux.meshModel.geometry.boundingBox.getCenter(localCenter);
        let worldCenter = Generaux.meshModel.localToWorld(localCenter);

        let planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), -worldCenter.y);
        let intersectPoint = new THREE.Vector3();
        Raycaster.raycaster.ray.intersectPlane(planeY, intersectPoint);
        sphere.position.copy(intersectPoint);
    }

    Scene3D.scene.add(sphere);
    /* console.log(sphere.uuid)
     console.log(Scene3D.scene)

     */
}

/**
 * Méthode qui retourne les trois points les plus proches du nouveau point créé
 * @param newPoint
 * @returns {*[]}
 */
function trouver3ptsProches(newPoint) {
    //trouver les trois points les plus proches
    let troisPoints = [];
    let pointsDejaAjoutes = new Set();
    let faces = mesh.faces;
    faces.forEach((uneFace) => {
        let distanceP1 = uneFace.edge.vertex.point.distance(newPoint);
        let distanceP2 = uneFace.edge.next.vertex.point.distance(newPoint);
        let distanceP3 = uneFace.edge.prev.vertex.point.distance(newPoint);

        // Ajouter les distances et les points à un tableau temporaire, uniquement si le point n'a pas déjà été ajouté
        if (!pointsDejaAjoutes.has(uneFace.edge.vertex.point)) {
            troisPoints.push({distance: distanceP1, point: uneFace.edge.vertex.point});
            pointsDejaAjoutes.add(uneFace.edge.vertex.point);
        }

        if (!pointsDejaAjoutes.has(uneFace.edge.next.vertex.point)) {
            troisPoints.push({distance: distanceP2, point: uneFace.edge.next.vertex.point});
            pointsDejaAjoutes.add(uneFace.edge.next.vertex.point);
        }

        if (!pointsDejaAjoutes.has(uneFace.edge.prev.vertex.point)) {
            troisPoints.push({distance: distanceP3, point: uneFace.edge.prev.vertex.point});
            pointsDejaAjoutes.add(uneFace.edge.prev.vertex.point);
        }


    })
    // Trier le tableau en fonction de la distance croissante
    troisPoints.sort((a, b) => a.distance - b.distance);
// Sélectionner les trois premiers points du tableau trié

    troisPoints = troisPoints.slice(0, 3);
    troisPoints = troisPoints.map((element) => element.point);

    return troisPoints;
}

/**
 * Méthode qui retourne les trois points les plus proches du nouveau point créé
 * @param newPoint
 * @returns {*[]}
 */
function trouver3ptsProches2(newPoint) {
    let positions = Array.from(generaux.geometry_model.getAttribute("position").array);
    let distances = [];
    //console.log(positions);
    for (let i = 0; i < positions.length; i += 9) {
        //console.log(i);
        let p1 = new Point(positions[i], positions[i + 1], positions[i + 2]);
        let p2 = new Point(positions[i + 3], positions[i + 4], positions[i + 5]);
        let p3 = new Point(positions[i + 6], positions[i + 7], positions[i + 8]);

        let distanceP1 = p1.distance(newPoint);
        let distanceP2 = p2.distance(newPoint);
        let distanceP3 = p3.distance(newPoint);
        let distanceTotale = distanceP1 + distanceP2 + distanceP3;
        distances.push({distance: distanceTotale, points: [p3, p2, p1]});
    }
    distances.sort((a, b) => a.distance - b.distance);
    return distances[0].points;
}

/**
 * Méthode mettant à jour la géométrie du modèle pour inclure le nouveau point et créer les
 * faces autour
 * @param newPoint
 * @param p1
 * @param p2
 */
function majBufferGeometry(newPoint, p1, p2) {
    let positionAttribute = geometry_model.attributes.position;
    //console.log(geometry_model.attributes.position)
    let positions = Array.from(positionAttribute.array);
    //console.log(positions);

    /*
    Il faut rentrer trois points sinon ça bug ! donc je dois trouver les points les plus proches au nouveau
    point avant de mettre à jour la structure
     */
    positions.push(newPoint.x);
    positions.push(newPoint.y);
    positions.push(newPoint.z);

    positions.push(p1.x);
    positions.push(p1.y);
    positions.push(p1.z);

    positions.push(p2.x);
    positions.push(p2.y);
    positions.push(p2.z);

    //console.log(positions)
    geometry_model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    // console.log(geometry_model);
}

/**
 * Méthode supprimant l'ancienne grande face (celle-ci devant être fractionnée en trois faces avec
 * comme point commun le point du milieu)
 * @param troisPoints
 */
function supprimerAncienneFace(troisPoints) {
    //console.log('dans suppression')
    //console.log(troisPoints);
    let positions = Array.from(generaux.geometry_model.getAttribute("position").array);
    //console.log(positions);
    for (let i = 0; i < positions.length; i += 9) {
        //console.log(i);
        let p1 = new Point(positions[i], positions[i + 1], positions[i + 2]);
        let p2 = new Point(positions[i + 3], positions[i + 4], positions[i + 5]);
        let p3 = new Point(positions[i + 6], positions[i + 7], positions[i + 8]);

        if (includePoint(troisPoints, p1) && includePoint(troisPoints, p2) && includePoint(troisPoints, p3)) {
            //console.log('contains point à i = ' + i);
            positions.splice(i, i + 9);
            geometry_model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        }
    }
}

/**
 * Méthode vérifiant qu'un point est inclu dans la liste
 * @param liste
 * @param point
 * @returns {boolean}
 */
function includePoint(liste, point) {
    let include = false
    liste.forEach((pointCourant) => {
        if (pointCourant.equals(point)) include = true;
    });
    return include;
}

/**
 * Méthode supprimant le point jaune de la scène
 */
export function removeSphere() {
    if (typeof sphere !== 'undefined') {
        Scene3D.scene.remove(sphere);
        sphere = undefined;
    }
}


function remplirStructureDeDonnees(newPoint, threePoint) {
    let faces = mesh.faces;
    let faceConcernee;
    console.log(faces);
    let face;
    for (let i = 0 ; i<faces.length; i++) {
        face = faces[i];
        let p1_research = face.edge.vertex.point;
        let p2_research = face.edge.next.vertex.point;
        let p3_research = face.edge.prev.vertex.point;
        if (includePoint(threePoint, p1_research) &&
            includePoint(threePoint, p2_research) &&
            includePoint(threePoint, p3_research)
        ) {
            faceConcernee = face;
            mesh.faces.splice(i, 1);
            console.log(faceConcernee);
            break;
        }
    }
    //nouveau sommet correspondant au nouveau point
    let newVertex = new Vertex(newPoint);
    //les halfedges et vertex de l'ancien triangle
    let h1 = faceConcernee.edge;
    let h2 = h1.next;
    let h3 = h1.prev;

    let v1 = h1.vertex;
    let v2 = h2.vertex;
    let v3 = h3.vertex;

    //création des halfedges des nouveaux triangles
    //1
    //h1
    let h4 = new HalfEdge(v2);
    let h5 = new HalfEdge(newVertex);
    //2
    //h2
    let h6 = new HalfEdge(newVertex);
    let h7 = new HalfEdge(v3);
    //3
    //h3
    let h8 = new HalfEdge(newVertex);
    let h9 = new HalfEdge(v1);
    //set les liens de ces nouvelles faces
    //f2
    let f2 = new Face(h1);
    setLiensOldHalfedge(h1, h4, h5, f2);
    mesh.faces.push(f2);
    setLiensNewHalfedge(h4, h5, h1,h6,f2);
    setLiensNewHalfedge(h5, h1, h4, h9, f2);
    console.log(h1);
    //f3
    let f3 = new Face(h2);
    setLiensOldHalfedge(h2, h7, h6, f3);
    mesh.faces.push(f3);
    setLiensNewHalfedge(h6, h2, h7, h4, f3);
    setLiensNewHalfedge(h7, h6, h2, h8, f3);
    //f4
    let f4 = new Face(h3);
    setLiensOldHalfedge(h3, h9, h8, f4);
    mesh.faces.push(f4);
    setLiensNewHalfedge(h8, h3, h9, h7, f4);
    setLiensNewHalfedge(h9, h8, h3, h5, f4);
    //set les tableau des vertex
    v1.addHalfEdge(h9);
    v2.addHalfEdge(h4);
    v3.addHalfEdge(h7);
    newVertex.addHalfEdge(h5);
    newVertex.addHalfEdge(h6);
    newVertex.addHalfEdge(h8)


}
function setLiensOldHalfedge (halfedge, next, prev, face){
    halfedge.setFace(face);
    halfedge.setNext(next);
    halfedge.setPrev(prev);
}
function setLiensNewHalfedge(halfedge, next, prev, opposite, face){
    halfedge.setNext(next);
    halfedge.setPrev(prev);
    halfedge.setOpposite(opposite);
    halfedge.setFace(face);
}