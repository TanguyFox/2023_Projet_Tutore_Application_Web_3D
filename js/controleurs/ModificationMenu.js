import {modifCoord} from '../fonctionnalites/ModifCoordPoint.js';
//EVENEMENT SUR LA MODIFICATION DES COORDONNEES D'UN POINT


export function initEventInputCoord(){
    let inputCoordonnees = document.querySelectorAll(".info-point input");
    console.log("modificationMenu")
    console.log(inputCoordonnees);

    inputCoordonnees.forEach(element => {
        console.log("foreach")
        element.addEventListener('keydown', function(event){
            if(event.keyCode === 13) modifCoord(event)
        } )
    });
}