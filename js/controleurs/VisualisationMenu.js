import * as Scene3D from "../vue/Scene3D.js";
import {selectFace} from "../fonctionnalites/SelectionFace";
import {scene, gridHelper} from "../vue/Scene3D.js";

/**
 * Module gérant les évènements liés au menu de modification, section Visualisation
 * @type {HTMLElement}
 */


//check mode face
let modeFaceHtml = document.getElementById('face-mode-check');


modeFaceHtml.addEventListener('change', selectFace);

document.getElementById('grid-check').addEventListener('change', function(event){
    if(event.target.checked){
        scene.add(gridHelper);
    }else{
        scene.remove(gridHelper);
    }
});