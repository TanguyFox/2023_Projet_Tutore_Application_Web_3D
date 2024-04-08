/**
 *  Module de gestion des évènement du menu de modification
 */

import {modifCoord} from '../fonctionnalites/ModifCoordPoint.js';
//EVENEMENT SUR LA MODIFICATION DES COORDONNEES D'UN POINT


export function initEventInputCoord(){
    let inputCoordonnees = document.querySelectorAll(".info-point input");
    // console.log(inputCoordonnees)
    inputCoordonnees.forEach(element => {
        element.addEventListener('change', function(event){
                modifCoord(event);
        } )
    });
}