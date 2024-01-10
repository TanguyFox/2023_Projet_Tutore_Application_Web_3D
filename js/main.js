
import * as Scene3D from "./vue/Scene3D.js";
import {handleFileSelect} from "./controleurs/ImportSTLfileEvent";
import {animate, onPointerClick} from "./controleurs/Scene3DControleur";
import * as ToolBarEvent from "./controleurs/ToolBarEvent.js";
import * as visualisationMenu from "./controleurs/VisualisationMenu.js";
import {onPointerMove} from "./fonctionnalites/SelectionFace";




let renderer = Scene3D.initScene3D();
const importButton = document.getElementById('import');
const input = document.getElementById("inputfile");
input.addEventListener('change', handleFileSelect);
importButton.addEventListener('click', function () {
    input.click();
});
animate();





// window.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('mousemove', onPointerMove, false);

//A Améliorer
Scene3D.sceneContrainer.addEventListener('mousedown', onPointerClick);

//unstable
// renderer.domElement.addEventListener('dblclick', onDoubleClick, false);
