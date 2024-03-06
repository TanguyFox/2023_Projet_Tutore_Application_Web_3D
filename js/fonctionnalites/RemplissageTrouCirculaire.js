/**
 * méthode qui analyse le tableau et qui l'envoie dans l'algorithme adéquat. Rappel de la fonction si
 * c'est un tableau de tableaux.
 * @param tableauDeTrous
 */
import {geometry_model} from "../tool/Element3DGeneraux";
import * as generaux from "../tool/Element3DGeneraux";
import * as THREE from "three";

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
    console.log(tableauDeVertex);
    if(tableauDeVertex.length%2===0){
        //tableau pair
        remplirTrouTableauPair(tableauDeVertex);
    } else {
        //tableau impair
        remplirTrouTableauImpair(tableauDeVertex);
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
        console.log(geometry_model);
        let positions = Array.from(geometry_model.getAttribute("position").array);
        console.log(positions);
        positions.push(tableauDeTrous[0].point.x, tableauDeTrous[0].point.y, tableauDeTrous[0].point.z);
        positions.push(tableauDeTrous[1].point.x, tableauDeTrous[1].point.y, tableauDeTrous[1].point.z);
        positions.push(tableauDeTrous[2].point.x, tableauDeTrous[2].point.y, tableauDeTrous[2].point.z);
        geometry_model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        console.log(geometry_model.getAttribute("position").array);
    } else {

    }

    return newTabTrou;
}

