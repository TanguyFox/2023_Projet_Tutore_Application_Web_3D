import * as Scene3D from "../vue/Scene3D.js";
import {handleModeSelect} from "../fonctionnalites/SelectionFace";
import {scene, gridHelper} from "../vue/Scene3D.js";
import * as generaux from "../tool/Element3DGeneraux.js";


/**
 * Module gérant les évènements liés au menu de modification, section Visualisation
 * @type {HTMLElement}
 */


//check mode face
let modeFaceHtml = document.getElementById('face-mode-check');


modeFaceHtml.addEventListener('change', handleModeSelect);

document.getElementById('grid-check').addEventListener('change', function(event){
    if(event.target.checked){
        scene.add(gridHelper);
    }else{
        scene.remove(gridHelper);
    }
});

document.getElementById('anti-aliasing-check').addEventListener('change', function(event){
    let antialiasEtat = event.target.checked;
    Scene3D.rebuildAll(antialiasEtat);
});

document.getElementById('maillage-texture-check').addEventListener('change', function(event){
    event.target.checked ? generaux.groupAsWireframe() : generaux.groupAsPlain();
});