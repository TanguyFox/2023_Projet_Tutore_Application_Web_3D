import {geometry_model, meshModel, mesh} from "../tool/Element3DGeneraux";
import * as generaux from "../tool/Element3DGeneraux";
import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import {majEdges} from "./ModifCoordPoint";
import {camera} from "../vue/Scene3D";
import {Vertex} from "../structure/Vertex";
import {HalfEdge} from "../structure/HalfEdge";
import {Face} from "../structure/Face";

/**
 * Module gérant le remplissage des trous dans un modèle 3D
 */

/*
 * méthode qui analyse le tableau et qui l'envoie dans l'algorithme adéquat. Rappel de la fonction si
 * c'est un tableau de tableaux.
 * @param tableauDeTrous
 */
export function remplirTrouTotal(tableauDeTrous) {

    console.log("dans trou total")
    console.log(tableauDeTrous);
    let tableauCourant;

    // On remplit chaque trou
    for (tableauCourant of tableauDeTrous) {
        console.log("tableauCourant")
        remplirTrouRepartisseur(tableauCourant);
    }

    geometry_model.computeBoundingSphere(); // Recalcul du sphere de la bounding box
    geometry_model.computeBoundingBox(); // Recalcul de la bounding box
    geometry_model.computeVertexNormals(); // Recalcul des normales
    geometry_model.attributes.position.needsUpdate = true; // Mise à jour des positions
    meshModel.geometry = geometry_model; // Mise à jour de la géométrie du mesh
    Scene3D.transformControls.detach();
    majEdges();
    //repairFacesNormals();
}

/**
 * fonction qui envoie le tableau dans la fonction adéquat par rapport à sa taille.
 * @param tableauDeVertex
 */
function remplirTrouRepartisseur(tableauDeVertex) {

    let tableau = tableauDeVertex;
    console.log(tableau);
    if (tableau.length !== 0) {

        // Si le tableau est de taille paire, on appelle la fonction de remplissage des trous pairs
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
 * INUTILISEE
 * Méthode qui permet de trouver le sens de parcours d'un tableau de trous
 * @param tableauTrou
 * @returns {*|*[]}
 */
function sensTableau(tableauTrou){
    console.log("recherche du sens du tableau", tableauTrou);
    let point = tableauTrou[0];
    console.log(point.point);
    let halfedge = mesh.getHalfedgeOfVertexWithoutOpposite(point);
    let i = 1;


    console.log(tableauTrou ,halfedge);
    if(typeof halfedge === "undefined"){
        console.log("ERROR : aucune halfedge correspondante à la frontière de ce trou", tableauTrou);
    } else {
        let ptsDep = halfedge.next.vertex;
        if(tableauTrou.includes(ptsDep)){
            let indexPtsDep = tableauTrou.indexOf(ptsDep);
            if(indexPtsDep===1){
                console.log("inversion du tableau")
                return preparerTableau(tableauTrou);
            }
            if (indexPtsDep===tableauTrou.length-1){
                console.log("non inversion du tableau")
                return tableauTrou;
            } else {
                throw new Error ("impossible de determiner le sens de parcours");
            }
        } else {
            ptsDep = halfedge.prev.vertex
            if(!tableauTrou.includes(ptsDep)){
                throw new Error("ne contient pas le point de depart de la lecture de tableau de trous");
            } else {
                let indexPtsDep = tableauTrou.indexOf(ptsDep);
                if(indexPtsDep===1){
                    return preparerTableau(tableauTrou) ;
                }
                if (indexPtsDep===tableauTrou.length-1){
                    return tableauTrou;
                } else {
                    throw new Error ("impossible de determiner le sens de parcours");
                }
            }
        }



    }

}

/**
 * Méthode qui permet de remplir un trou en fonction de sa taille
 * @param tableauDeTrous tableau de trous
 * @param fonctionDo fonction qui permet de remplir un trou
 * @param fonctionVerification fonction qui permet de vérifier si le trou est rempli
 */
function remplirTrouAll(tableauDeTrous, fonctionDo, fonctionVerification){
    if(tableauDeTrous.length===3){
        remplirGeometry(tableauDeTrous)
    } else {
        let indexCourant = 0;
        let pointDebutFace = tableauDeTrous[indexCourant];
        let tableauProchainRemplissage = [];
        let tabUneFace = [];
        do{
            tableauProchainRemplissage.push(pointDebutFace)
            indexCourant = fonctionDo(tableauDeTrous, tabUneFace, pointDebutFace, indexCourant);
            remplirGeometry(tabUneFace);
            pointDebutFace = tableauDeTrous[indexCourant];
            tabUneFace = [];
        } while (fonctionVerification(tableauDeTrous, pointDebutFace))
        if(fonctionDo.name === "remplirTrouTableauImpair2"){
            tabUneFace.push(pointDebutFace, tableauDeTrous[0], tableauDeTrous[2]);
            remplirGeometry(tabUneFace);
        }
        if(tableauProchainRemplissage.length >=  3){
            remplirTrouRepartisseur(tableauProchainRemplissage);
        }
    }
}

/**
 * INUTILISEE
 * Méthode qui permet de trouver le troisième point d'un triangle
 * @param tableauPoints
 * @param point1
 * @param point2
 * @returns {*|null}
 */
function trouverTroisiemePoint(tableauPoints, point1, point2) {

    for (let i = 0; i < tableauPoints.length; i++) {
        const currentPoint = tableauPoints[i];
        // Vérifier si le point courant n'est ni point1 ni point2
        if (!currentPoint.equals(point1) && !currentPoint.equals(point2)) {
            return currentPoint;
        }
    }
    // Retourner null si le troisième point n'a pas été trouvé
    return null;
}
/**
 * méthode qui rempli un tableau de trous ayant une longueur paire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 */
function remplirTrouTableauPair(tableauDeTrous) {
    let indexCourant = 0;
    let pointDebutFace = tableauDeTrous[indexCourant];
    let tableauProchainRemplissage = [];
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
        remplirGeometry(tabUneFace);
        pointDebutFace = tableauDeTrous[indexCourant];
        tabUneFace = [];


    } while (tableauDeTrous.indexOf(pointDebutFace) !== 0)
    if (tableauProchainRemplissage.length >= 3) {
        remplirTrouRepartisseur(tableauProchainRemplissage);
    }
}

/**
 * INUTILISEE
 * méthode qui rempli un tableau de trous ayant une longueur paire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 * @param tabUneFace
 * @param pointDebutFace
 * @param indexCourant
 * @returns {*}
 */
function remplirTrouTableauPair2(tableauDeTrous, tabUneFace, pointDebutFace, indexCourant){
    if (typeof tableauDeTrous[indexCourant + 2] == 'undefined') {
        tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[0]);
        indexCourant = 0;

    } else {
        tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[indexCourant + 2]);
        indexCourant += 2;
    }
    return indexCourant;
}



/**
 * méthode qui repli un tableau de trous ayant une longueur impaire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 * @returns {*}
 */
function remplirTrouTableauImpair(tableauDeTrous) {
    console.log("dans remplissage tableau impair")
    if (tableauDeTrous.length === 3) {
        remplirGeometry(tableauDeTrous);
    } else {
        let indexCourant = 0;
        let pointDebutFace = tableauDeTrous[indexCourant];
        let tableauProchainRemplissage = [];
        let tabUneFace = [];
        do{
            //j'ajoute dans le tableau le point debut face qui constituera le prochain tableau de trous
            tableauProchainRemplissage.push(pointDebutFace);
            tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[indexCourant + 2]);
            console.log(tabUneFace);
            remplirGeometry(tabUneFace);
            tabUneFace = [];
            indexCourant += 2;
            pointDebutFace = tableauDeTrous[indexCourant];

        } while (tableauDeTrous.indexOf(pointDebutFace) !== tableauDeTrous.length - 1)
        tabUneFace.push(pointDebutFace, tableauDeTrous[0], tableauDeTrous[2]);
        remplirGeometry(tabUneFace);
        console.log(tabUneFace);
        if (tableauProchainRemplissage.length !== 0) {
            remplirTrouRepartisseur(tableauProchainRemplissage);
        }
    }
}

/**
 * INUTILISEE
 * méthode qui repli un tableau de trous ayant une longueur impaire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 * @param tabUneFace
 * @param pointDebutFace
 * @param indexCourant
 * @returns {*}
 */
function remplirTrouTableauImpair2(tableauDeTrous, tabUneFace,pointDebutFace,indexCourant) {
    tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[indexCourant + 2]);
    indexCourant += 2;
    return indexCourant;
}


/**
 * Méthode permettant de remplir une face dans la géométrie
 * @param tableauUneFace
 */
function remplirGeometry(tableauUneFace) {
    let positions = Array.from(geometry_model.getAttribute("position").array);
    positions.push(tableauUneFace[0].point.x, tableauUneFace[0].point.y, tableauUneFace[0].point.z);
    positions.push(tableauUneFace[1].point.x, tableauUneFace[1].point.y, tableauUneFace[1].point.z);
    positions.push(tableauUneFace[2].point.x, tableauUneFace[2].point.y, tableauUneFace[2].point.z);

    geometry_model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
}

/**
 * Méthode qui inverse le sens de parcours d'un tableau
 * @param tableauSensHoraire
 * @returns {*[]}
 */
function preparerTableau(tableauSensHoraire) {
    let firstSommet = tableauSensHoraire.shift();
    tableauSensHoraire.reverse();
    return [firstSommet].concat(tableauSensHoraire);
}

/**
 * INUTILISEE
 * Méthode qui permet de réparer les normales des faces
 */
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

