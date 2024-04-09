import {initEventAjPoint} from "../controleurs/MenuContextuelControleur";
import * as Scene3DControleur from "../controleurs/Scene3DControleur";

/**
 * Module gérant le menu contextuel permettant de créer des points
 */


// HTML du menu contextuel
const html = `
<div class="menuContextuel">
  <a href="#"><div id="ajPoint">Point</div></a>
  <a href="#"><div></div></a>
  <a href="#"><div></div></a>
  <a href="#"><div></div></a>
  <a href="#"><div id="suppMenuContextuel"></div></a>
</div>
`;

// Div du menu contextuel
const menuContextuelDiv = document.querySelector("#menuContextuel");

/**
 * Fonction permettant de faire apparaitre le menu contextuel
 * @param event - événement de souris
 */
export function appearMenuContextuel(event){

    if(!Scene3DControleur.ModificationMod){
        return;
    }

    menuContextuelDiv.innerHTML = html;

    // Positionnement du menu contextuel
    menuContextuelDiv.style.top = event.clientY + "px";
    menuContextuelDiv.style.left = event.clientX + "px";

    // Affichage du menu contextuel
    menuContextuelDiv.style.display = "initial";
    menuContextuelDiv.children[0].style.opacity = "1";

    menuContextuelDiv.children[0].addEventListener('click', hiddenMenuContextuel);
    initEventAjPoint(); // Ajout de l'événement pour ajouter un point
}

menuContextuelDiv.addEventListener('mouseleave', hiddenMenuContextuel);

/**
 * Fonction permettant de faire disparaitre le menu contextuel
 */
function hiddenMenuContextuel(){
    setTimeout(function (){
        menuContextuelDiv.innerHTML='';
        menuContextuelDiv.style.top = "120%";
        menuContextuelDiv.style.left = "120%";
        menuContextuelDiv.style.display = "none";
    }, 350);
}

