import {geometry_model, meshModel, mesh} from "../tool/Element3DGeneraux";
import * as generaux from "../tool/Element3DGeneraux";
import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import {majEdges} from "./ModifCoordPoint";
import {camera} from "../vue/Scene3D";
import {Vertex} from "../structure/Vertex";
import {HalfEdge} from "../structure/HalfEdge";
import {Face} from "../structure/Face";


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
        remplirTrouRepartisseur(tableauCourant);
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
function remplirTrouRepartisseur(tableauDeVertex) {
    //let tableau = preparerTableau(tableauDeVertex);
    let tableau = sensTableau(tableauDeVertex);
    console.log(tableau);
    if (tableau.length !== 0) {
        if (tableau.length % 2 === 0) {
            //tableau pair
            //remplirTrouTableauPair(tableau);
            remplirTrouAll(tableau, remplirTrouTableauPair2, verifTabPair);
        } else {
            //tableau impair
            //remplirTrouTableauImpair(tableau);
            remplirTrouAll(tableau, remplirTrouTableauImpair2, verifTabImpair);
        }
    }

}

function sensTableau(tableauTrou){
    let point = tableauTrou[0];
    console.log(point.point);
    let halfedge = mesh.getHalfedgeOfVertexWithoutOpposite(point);
    let i = 1;
   /* while (typeof halfedge === "undefined" && i < tableauTrou.length){
        point = tableauTrou[i];
        halfedge = mesh.getHalfedgeOfVertexWithoutOpposite(point);
        i++;
    }*/
    console.log(tableauTrou ,halfedge);
    if(typeof halfedge === "undefined"){
        console.log("ERROR : aucune halfedge correspondante à la frontière de ce trou", tableauTrou);
    } else {
        let ptsDep = halfedge.next.vertex;
        if(tableauTrou.includes(ptsDep)){
            let indexPtsDep = tableauTrou.indexOf(ptsDep);
            if(indexPtsDep===1){
                return preparerTableau(tableauTrou);
            }
            if (indexPtsDep===tableauTrou.length-1){
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

function completerStructure(tabUneFace){
    let v1 = tabUneFace[0];
    let v2 = tabUneFace[1];
    let v3 = tabUneFace[2];
    let h;
    let i = 0;
    do {
        h  = mesh.getHalfedgeOfVertexWithoutOpposite(tabUneFace[i]);
        i++;
    } while (typeof h === 'undefined' && i<tabUneFace.length);
    if(typeof h === 'undefined'){
        throw new Error("la face nouvellement créé n'a pas d'opposé")
    }
    let pointDep = h.next.vertex;
    let pointSuivant = h.vertex;
    let dernierPoint = trouverTroisiemePoint(tabUneFace, pointDep, pointSuivant);
    let opposeeDirect = new HalfEdge(pointDep);
    opposeeDirect.opposite = h;
    let h2 = new HalfEdge(pointSuivant);
    let h3 = new HalfEdge(dernierPoint);
    let newFace = new Face(opposeeDirect);
    mesh.faces.add(newFace);
    setnextAndPrev(opposeeDirect, h2, h3);
    setnextAndPrev(h2, h3, opposeeDirect);
    setnextAndPrev(h3, opposeeDirect, h2);
    //TODO
}
function setnextAndPrev(h1, h2, h3){
    h1.next = h2;
    h1.prev = h3;
}


function trouverTroisiemePoint(tableauPoints, point1, point2) {
    // Boucler à travers les points dans le tableau
    for (let i = 0; i < tableauPoints.length; i++) {
        // Vérifier si le point courant est différent des deux points donnés
        if (tableauPoints[i].x !== point1.x || tableauPoints[i].y !== point1.y || tableauPoints[i].z !== point1.z) {
            if (tableauPoints[i].x !== point2.x || tableauPoints[i].y !== point2.y || tableauPoints[i].z !== point2.z) {
                // Si le point courant est différent des deux points donnés, retourner ce point
                return tableauPoints[i];
            }
        }
    }

    // Retourner null si aucun point n'a été trouvé
    return null;
}
/**
 * méthode qui rempli un tableau de trous ayant une longueur paire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 */
/*function remplirTrouTableauPair(tableauDeTrous) {
    console.log("dans remplissage tableau pair")
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
       // console.log(tabUneFace)
        remplirGeometry(tabUneFace);
        pointDebutFace = tableauDeTrous[indexCourant];
       // console.log("indexCourant = " + indexCourant);
        tabUneFace = [];
       // console.log(tabUneFace);


    } while (tableauDeTrous.indexOf(pointDebutFace) !== 0)
    if (tableauProchainRemplissage.length >= 3) {
        remplirTrouRepartisseur(tableauProchainRemplissage);
    }
}*/
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
function verifTabPair(tableauDeTrous, pointDebutFace){
    return tableauDeTrous.indexOf(pointDebutFace) !== 0;
}



/**
 * méthode qui repli un tableau de trous ayant une longueur impaire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 * @returns {*}
 */
/*function remplirTrouTableauImpair(tableauDeTrous) {
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
}*/
function remplirTrouTableauImpair2(tableauDeTrous, tabUneFace,pointDebutFace,indexCourant) {
    tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant + 1], tableauDeTrous[indexCourant + 2]);
    indexCourant += 2;
    return indexCourant;
}
function verifTabImpair(tableauDeTrous, pointDebutFace){
    return tableauDeTrous.indexOf(pointDebutFace) !== tableauDeTrous.length - 1;
}



function remplirGeometry(tableauUneFace) {
    //tableauUneFace = detectSensParcours(tableauUneFace);
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

