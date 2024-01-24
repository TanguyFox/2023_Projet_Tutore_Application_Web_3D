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



export function ajoutPoint(menuContextuel){
    let sphere = ajPoint3D();
    afficherSingleCoordPoint('', sphere, sphere.position, "#ffff00");
    //initEventInputCoord();
   // remplirStructureDeDonnees(sphere.position);
    let newPoint = new Point(sphere.position.x, sphere.position.y, sphere.position.z);
    let troisPointsProches = trouver3ptsProches2(newPoint);
    console.log(troisPointsProches);
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
}

/**
 * méthode ajoutant un point jaune dans le plan 3D à l'endroit du pointeur
 */
function ajPoint3D(){

    let mouse = {x : 0, y : 0};
    mouse.x = Raycaster.pointer.x;
    mouse.y = Raycaster.pointer.y;

    // Utilisez la fonction unproject pour convertir les coordonnées de l'écran en coordonnées de la scène en 3D
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);

    // Obtenez la liste des objets intersectés
    let intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);

    let isObject = false;

    // Créez une nouvelle sphère à la position du clic
    let geometry = new THREE.SphereGeometry(0.05, 16, 16);
    let material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    let sphere = new THREE.Mesh(geometry, material);

    for(let i = 0; i < intersects.length; i ++ ){

        if(intersects[i].object.uuid === Generaux.meshModel.uuid){
            console.log(intersects[i]);
            isObject = true;

            sphere.position.copy(intersects[i].point);
            break;
        }
    }

    if(!isObject){
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


    return sphere;
}

function trouver3ptsProches(newPoint){
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
            troisPoints.push({ distance: distanceP1, point: uneFace.edge.vertex.point });
            pointsDejaAjoutes.add(uneFace.edge.vertex.point);
        }

        if (!pointsDejaAjoutes.has(uneFace.edge.next.vertex.point)) {
            troisPoints.push({ distance: distanceP2, point: uneFace.edge.next.vertex.point });
            pointsDejaAjoutes.add(uneFace.edge.next.vertex.point);
        }

        if (!pointsDejaAjoutes.has(uneFace.edge.prev.vertex.point)) {
            troisPoints.push({ distance: distanceP3, point: uneFace.edge.prev.vertex.point });
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

function trouver3ptsProches2(newPoint){
    let positions = Array.from(generaux.geometry_model.getAttribute("position").array);
    let distances =[] ;
    console.log(positions);
    for(let i = 0 ; i<positions.length; i+=9){
        console.log(i);
        let p1 = new Point(positions[i], positions[i + 1], positions[i + 2]);
        let p2 = new Point(positions[i + 3], positions[i + 4], positions[i + 5]);
        let p3 = new Point(positions[i + 6], positions[i + 7], positions[i + 8]);

        let distanceP1 = p1.distance(newPoint);
        let distanceP2 = p2.distance(newPoint);
        let distanceP3 = p3.distance(newPoint);
        let distanceTotale = distanceP1+distanceP2+distanceP3;
        distances.push({distance : distanceTotale, points:[p3,p2,p1]});
    }
    distances.sort((a,b) => a.distance - b.distance);
    return distances[0].points;
}

function majBufferGeometry(newPoint, p1, p2){
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
    geometry_model.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
   // console.log(geometry_model);
}

function supprimerAncienneFace(troisPoints){
    console.log('dans suppression')
    console.log(troisPoints);
    let positions = Array.from(generaux.geometry_model.getAttribute("position").array);
    console.log(positions);
    for(let i = 0 ; i<positions.length; i+=9){
        console.log(i);
        let p1 = new Point(positions[i], positions[i + 1], positions[i + 2]);
        let p2 = new Point(positions[i + 3], positions[i + 4], positions[i + 5]);
        let p3 = new Point(positions[i + 6], positions[i + 7], positions[i + 8]);

        if(includePoint(troisPoints, p1) && includePoint(troisPoints, p2) && includePoint(troisPoints, p3)){
            console.log('contains point à i = ' + i);
            positions.splice(i, i+9);
            geometry_model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        }
    }
}

function includePoint(liste, point){
    let include = false
    liste.forEach((pointCourant)=>{
        if(pointCourant.equals(point)) include = true;
    });
    return include;
}

function remplirStructureDeDonnees(coordonnees){

}
