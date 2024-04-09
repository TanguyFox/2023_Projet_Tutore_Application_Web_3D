import * as Scene3D from "../vue/Scene3D.js";
import {handleModeSelect} from "../fonctionnalites/SelectionFace";
import {scene, gridHelper} from "../vue/Scene3D.js";
import * as generaux from "../tool/Element3DGeneraux.js";
import {group_triangles} from "../tool/DetectionIntersection";
import * as Genereaux from "../tool/Element3DGeneraux";

/**
 * Module gérant les évènements liés au menu de modification, section Visualisation
 * @type {HTMLElement}
 */


//check mode face
document.getElementById('face-mode-check').addEventListener('change', handleModeSelect);

// Affichage / supression de la grille lorsque la checkbox est cochée / décochée
document.getElementById('grid-check').addEventListener('change', function(event){
    if(event.target.checked){
        scene.add(gridHelper);
    }else{
        scene.remove(gridHelper);
    }
});

// Activation / désactivation de l'anti-aliasing
document.getElementById('anti-aliasing-check').addEventListener('change', function(event){
    Scene3D.rebuildAll(event.target.checked);
});

// Activation / désactivation du maillage de la texture
document.getElementById('maillage-texture-check').addEventListener('change', function(event){
    event.target.checked ? generaux.groupAsWireframe() : generaux.groupAsPlain();
});

// Activation / désactivation de l'affichage des faces intersectées
let inter_button_toggle = true;
document.getElementById("inter_button").addEventListener("click", function(){
    if(inter_button_toggle){
        document.getElementById("inter_button").textContent = "Supprimer les faces intersectées";
        Scene3D.scene.remove(Genereaux.group);
        Genereaux.group.add(group_triangles);
        Scene3D.scene.add(Genereaux.group);
        inter_button_toggle = false;
    }else{
        document.getElementById("inter_button").textContent = "Afficher les faces intersectées";
        Scene3D.scene.remove(Genereaux.group);
        Genereaux.group.remove(group_triangles);
        Scene3D.scene.add(Genereaux.group);
        inter_button_toggle = true;
    }
});

// Reset de l'affichage des faces intersectées
function resetInterButton(){
    document.getElementById("inter_button").textContent = "Afficher les faces intersectées";
    inter_button_toggle = true;
}

export {
    resetInterButton
}