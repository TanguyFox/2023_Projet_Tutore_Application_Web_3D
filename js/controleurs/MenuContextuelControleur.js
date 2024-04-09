/**
 * Module gérant le menu contextuel
 */

import {ajoutPoint} from "../fonctionnalites/AjoutPoint";

/**
 * Fonction qui initialise les événements du menu contextuel
 * Lors du clic sur le bouton "ajouter un point" du menu contextuel, on appelle la fonction ajoutPoint
 */
export function initEventAjPoint(){
    const menuContextuelDiv = document.querySelector("#menuContextuel");
    const boutonPoint = menuContextuelDiv.children[0].children[0];

    boutonPoint.addEventListener('click', function(){
        ajoutPoint(menuContextuelDiv);
    })
}
