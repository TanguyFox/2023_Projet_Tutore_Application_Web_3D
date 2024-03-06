import {geometry_model} from "../tool/Element3DGeneraux";
import * as generaux from "../tool/Element3DGeneraux";
import * as THREE from "three";


/*
 * méthode qui analyse le tableau et qui l'envoie dans l'algorithme adéquat. Rappel de la fonction si
 * c'est un tableau de tableaux.
 * @param tableauDeTrous
 */
export function remplirTrouTotal(tableauDeTrous){
    console.log(tableauDeTrous);
    let tableauCourant;
    for(tableauCourant of tableauDeTrous){
       remplirTrou(tableauCourant);
    }
}

/**
 * fonction qui envoie le tableau dans la fonction adéquat par rapport à sa taille.
 * @param tableauDeVertex
 */
function remplirTrou(tableauDeVertex){
    let tableau = preparerTableau(tableauDeVertex);
    console.log(tableau);
    if(tableau.length%2===0){
        //tableau pair
        remplirTrouTableauPair(tableau);
    } else {
        //tableau impair
        remplirTrouTableauImpair(tableau);
    }
}

/**
 * méthode qui rempli un tableau de trous ayant une longueur paire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 */
function remplirTrouTableauPair(tableauDeTrous){
    let newTabTrou;

    //TODO
    return newTabTrou;
}

/**
 * méthode qui repli un tableau de trous ayant une longueur impaire. Renvoie le tableau de trou restant.
 * @param tableauDeTrous
 * @returns {*}
 */
function remplirTrouTableauImpair(tableauDeTrous){
    let newTabTrou;
    if(tableauDeTrous.length===3){
        console.log(`facet\n  outer loop\n
           vertex ${tableauDeTrous[0].point.x} ${tableauDeTrous[0].point.y} ${tableauDeTrous[0].point.z}\n
           vertex ${tableauDeTrous[1].point.x} ${tableauDeTrous[1].point.y} ${tableauDeTrous[1].point.z}\n
           vertex ${tableauDeTrous[2].point.x} ${tableauDeTrous[2].point.y} ${tableauDeTrous[2].point.z}\n
          endloop\n
        endfacet`);
        remplirGeometry(tableauDeTrous);
    } else {
        let indexCourant = 0;
        let pointDebutFace = tableauDeTrous[indexCourant];
        let pointTerminusDebutFace = tableauDeTrous[tableauDeTrous.length-1].point;
        let tableauProchainRemplissage = [];
        let tabUneFace = [];
        while(tableauDeTrous.indexOf(pointDebutFace)!==tableauDeTrous.length-1){
            if(tableauDeTrous.indexOf(pointDebutFace)!==0){
                //j'ajoute dans le tableau le point debut face qui constituera le prochain tableau de trous
                tableauProchainRemplissage.push(pointDebutFace);
            }
            tabUneFace.push(pointDebutFace, tableauDeTrous[indexCourant+1], tableauDeTrous[indexCourant+2]);
            console.log(tabUneFace);
            remplirGeometry(tabUneFace);
            tabUneFace=[];
            indexCourant+=2;
            pointDebutFace = tableauDeTrous[indexCourant];

        }
        tabUneFace.push(pointDebutFace, tableauDeTrous[0], tableauDeTrous[2]);
        remplirGeometry(tabUneFace);
        console.log(tabUneFace);
    }

    return newTabTrou;
}

function remplirGeometry(tableauUneFace){
    let positions = Array.from(geometry_model.getAttribute("position").array);
    console.log(positions);
    positions.push(tableauUneFace[0].point.x, tableauUneFace[0].point.y, tableauUneFace[0].point.z);
    positions.push(tableauUneFace[1].point.x, tableauUneFace[1].point.y, tableauUneFace[1].point.z);
    positions.push(tableauUneFace[2].point.x, tableauUneFace[2].point.y, tableauUneFace[2].point.z);
    geometry_model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    console.log(geometry_model.getAttribute("position").array);
}

function preparerTableau(tableauSensHoraire){
    let firstSommet = tableauSensHoraire[0];
    tableauSensHoraire.shift();
    tableauSensHoraire.reverse();
    return [firstSommet].concat(tableauSensHoraire);
}

