import {transformControls} from "../vue/Scene3D";
import * as THREE from "three";

/**
 *Module gérant les évènements de la toolbar
 */

let toolbarElements = document.querySelector('#toolbar').childNodes;

//toolbar event
toolbarElements.forEach((e) => {
        if (e.nodeName === 'DIV') {
            e.addEventListener('click', eventToolbar);
        }
    }
)

/**
 * Fonction qui gère les évènements de la toolbar
 * Si l'objet sélectionné est une sphère, on ne peut pas la redimensionner
 * On peut seulement la déplacer
 * On change le mode de transformation de l'objet
 * @param event
 */
function eventToolbar(event) {
    if(transformControls.object instanceof THREE.Mesh && transformControls.object.geometry.type === "SphereGeometry"){
        transformControls.setMode("translate");
        return;
    }

    transformControls.setMode(event.target.id)
}