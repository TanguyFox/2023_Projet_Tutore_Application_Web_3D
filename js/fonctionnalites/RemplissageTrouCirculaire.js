import {geometry_model, meshModel} from "../tool/Element3DGeneraux";
import * as generaux from "../tool/Element3DGeneraux";
import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import {majEdges} from "./ModifCoordPoint";
import {camera} from "../vue/Scene3D";


/*
 * méthode qui analyse le tableau et qui l'envoie dans l'algorithme adéquat. Rappel de la fonction si
 * c'est un tableau de tableaux.
 * @param tableauDeTrous
 */
export function remplirTrouTotal(tableauDeTrous) {
    console.log("dans trou total")
    console.log(tableauDeTrous);
    let tableauCourant;
    for (tableauCourant of tableauDeTrous) {
        console.log("tableauCourant")
        remplirTrou(tableauCourant);
    }

    geometry_model.computeBoundingSphere(); // Recalcul du sphere de la bounding box
    geometry_model.computeBoundingBox(); // Recalcul de la bounding box
    geometry_model.computeVertexNormals();
    geometry_model.attributes.position.needsUpdate = true;
    meshModel.geometry = geometry_model;
    Scene3D.transformControls.detach();
    majEdges();
    //repairFacesNormals();
}

/**
 * fonction qui envoie le tableau dans la fonction adéquat par rapport à sa taille.
 * @param tableauDeVertex
 */
function remplirTrou(tableauDeVertex) {
    //let tableau = preparerTableau(tableauDeVertex);
    let tableau = tableauDeVertex;
    console.log(tableau);
    if (tableau.length !== 0) {
        if (tableau.length % 2 === 0) {
            //tableau pair
            remplirTrouTableauPair(tableau);
        } else {
            //tableau impair
            remplirTrouTableauImpair(tableau);
        }
    }

}

/**
 * méthode qui rempli un tableau de trous ayant une longueur paire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 */
function remplirTrouTableauPair(tableauDeTrous) {
    console.log("dans remplissage tableau pair")
    let indexCourant = 0;
    let tableauProchainRemplissage = [];
    let pointDebutFace = tableauDeTrous[0];
    let tabUneFace = [];
    do {
        tableauProchainRemplissage.push(pointDebutFace);
        if (typeof tableauDeTrous[indexCourant + 2] == 'undefined') {
            tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[0]);
            indexCourant = 0;

        } else {
            tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[indexCourant + 2]);
            indexCourant += 2;
        }
       // console.log(tabUneFace)
        remplirGeometry(tabUneFace);
        pointDebutFace = tableauDeTrous[indexCourant];
       // console.log("indexCourant = " + indexCourant);
        tabUneFace = [];
       // console.log(tabUneFace);


    } while (tableauDeTrous.indexOf(pointDebutFace) !== 0)
    if (tableauProchainRemplissage.length >= 3) {
        remplirTrou(tableauProchainRemplissage);
    }
}

/**
 * méthode qui repli un tableau de trous ayant une longueur impaire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 * @returns {*}
 */
function remplirTrouTableauImpair(tableauDeTrous) {
    console.log("dans remplissage tableau impair")
    if (tableauDeTrous.length === 3) {
        /*console.log(`facet\n  outer loop\n
           vertex ${tableauDeTrous[0].point.x} ${tableauDeTrous[0].point.y} ${tableauDeTrous[0].point.z}\n
           vertex ${tableauDeTrous[1].point.x} ${tableauDeTrous[1].point.y} ${tableauDeTrous[1].point.z}\n
           vertex ${tableauDeTrous[2].point.x} ${tableauDeTrous[2].point.y} ${tableauDeTrous[2].point.z}\n
          endloop\n
        endfacet`);*/
        remplirGeometry(tableauDeTrous);
    } else {
        let indexCourant = 0;
        let pointDebutFace = tableauDeTrous[indexCourant];
        let pointTerminusDebutFace = tableauDeTrous[tableauDeTrous.length - 1].point;
        let tableauProchainRemplissage = [];
        let tabUneFace = [];
        while (tableauDeTrous.indexOf(pointDebutFace) !== tableauDeTrous.length - 1) {
            //j'ajoute dans le tableau le point debut face qui constituera le prochain tableau de trous
            tableauProchainRemplissage.push(pointDebutFace);
            tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[indexCourant + 2]);
            console.log(tabUneFace);
            remplirGeometry(tabUneFace);
            tabUneFace = [];
            indexCourant += 2;
            pointDebutFace = tableauDeTrous[indexCourant];

        }
        tabUneFace.push(pointDebutFace, tableauDeTrous[0], tableauDeTrous[2]);
        remplirGeometry(tabUneFace);
        console.log(tabUneFace);
        if (tableauProchainRemplissage.length !== 0) {
            remplirTrou(tableauProchainRemplissage);
        }
    }
}

function remplirGeometry(tableauUneFace) {
    tableauUneFace = detectSensParcours(tableauUneFace);
    let positions = Array.from(geometry_model.getAttribute("position").array);
    //console.log(positions);
    positions.push(tableauUneFace[0].point.x, tableauUneFace[0].point.y, tableauUneFace[0].point.z);
    positions.push(tableauUneFace[1].point.x, tableauUneFace[1].point.y, tableauUneFace[1].point.z);
    positions.push(tableauUneFace[2].point.x, tableauUneFace[2].point.y, tableauUneFace[2].point.z);

    geometry_model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    // console.log(geometry_model.getAttribute("position").array);

}

function preparerTableau(tableauSensHoraire) {
    let firstSommet = tableauSensHoraire[0];
    tableauSensHoraire.shift();
    tableauSensHoraire.reverse();
    return [firstSommet].concat(tableauSensHoraire);
}

function repairFacesNormals() {
    const normal = new THREE.Vector3();
    geometry_model.computeVertexNormals();
    const normalAttribute = geometry_model.getAttribute('normal');
    for (let i = 0; i < normalAttribute.count; i++) {
        normal.x += normalAttribute.getX(i);
        normal.y += normalAttribute.getY(i);
        normal.z += normalAttribute.getZ(i);
    }

    normal.divideScalar(normalAttribute.count);

// Vérifier l'orientation des faces par rapport à la normale moyenne
    for (let i = 0; i < normalAttribute.count; i++) {
        const faceNormal = new THREE.Vector3(
            normalAttribute.getX(i),
            normalAttribute.getY(i),
            normalAttribute.getZ(i)
        );

        // Vérifier si la normale de la face est opposée à la normale moyenne
        if (faceNormal.dot(normal) < 0) {
            console.log("Face mal orientée :", i / 3);
        }
    }
}

function detectSensParcours(points) {
    geometry_model.computeVertexNormals();
    console.log("Detect sens parcours");
    console.log(points);
    let v1 = points[0];
    let v2 = points[1];
    let v3 = points[2];
    console.log(v1, v2, v3);
    let edge1 = new THREE.Vector3().subVectors(v2, v1);
    let edge2 = new THREE.Vector3().subVectors(v3, v1);
    if (edge1.cross(edge2).length() === 0) {
        console.log('Les vecteurs sont colinéaires');
    }

   // let normal = geometry_model.getAttribute('normal');
    /*let valeurNormal = normal.x * v1.x + normal.y * v1.y + normal.z * v1.z;
    console.log("valeur normale : ", valeurNormal);*/
    let normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();
    console.log(normal);
    console.log(normal.dot(v1))
    if(normal.dot(v1) < 0){
        //la normale pointe vers l'intérieur, on retourn le tableau
        console.log("points vers l'intérieur")
        return points.reverse();
    } else {
        console.log("points vers l'extérieur")
        return points;
    }
}

