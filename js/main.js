
import * as Scene3D from "./vue/Scene3D.js";
import {handleFileSelect} from "./controleurs/ImportSTLfileEvent";
import {animate, onPointerClick, onDoubleClick} from "./controleurs/Scene3DControleur";
import * as ToolBarEvent from "./controleurs/ToolBarEvent.js";
import * as visualisationMenu from "./controleurs/VisualisationMenu.js";
import {onPointerMove} from "./fonctionnalites/SelectionFace";
import {mesh, geometry_model} from "./tool/Element3DGeneraux";
//import {displayModal, exportMesh} from "./fonctionnalites/ExportModel"
import * as modificationMenu from './controleurs/ModificationMenu.js';



let renderer = Scene3D.initScene3D();
const importButton = document.getElementById('import');
const input = document.getElementById("inputfile");
//const exportTab = document.getElementById("export")
const exportButton = document.getElementById("exportButton")
input.addEventListener('change', handleFileSelect);
importButton.addEventListener('click', function () {
    input.click();
});
animate();

renderer.domElement.addEventListener('mousemove', onPointerMove, false);

Scene3D.sceneContrainer.addEventListener('mousedown', onPointerClick);

renderer.domElement.addEventListener('dblclick', onDoubleClick, false);

//exportTab.addEventListener("click", displayModal)
/*exportButton.addEventListener("click", function () {
    exportMesh(Scene3D.scene);
})*/
console.log(mesh);