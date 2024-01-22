import {modifCoord} from '../fonctionnalites/ModifCoordPoint.js';
//EVENEMENT SUR LA MODIFICATION DES COORDONNEES D'UN POINT


export function initEventInputCoord(){
    let inputCoordonnees = document.querySelectorAll(".info-point input");
    inputCoordonnees.forEach(element => {
        element.addEventListener('keydown', function(event){
            if(event.key === "Enter") modifCoord(event)
        } )
    });
}