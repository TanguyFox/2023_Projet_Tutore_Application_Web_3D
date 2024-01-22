
import * as Scene3D from "./vue/Scene3D.js";
import {handleFileSelect} from "./controleurs/ImportSTLfileEvent";
import {animate, onPointerClick, onDoubleClick} from "./controleurs/Scene3DControleur";
import * as ToolBarEvent from "./controleurs/ToolBarEvent.js";
import * as visualisationMenu from "./controleurs/VisualisationMenu.js";
import {onPointerMove} from "./fonctionnalites/SelectionFace";
import {mesh, geometry_model} from "./tool/Element3DGeneraux";
import {displayModal, exportMesh} from "./fonctionnalites/ExportModel"
import * as modificationMenu from './controleurs/ModificationMenu.js';
import {deplacerPoint, mouseUpReinitialisation, setMouseDown} from "./fonctionnalites/ModifCoordPoint";



let renderer = Scene3D.initScene3D();
const importButton = document.getElementById('import');
const input = document.getElementById("inputfile");
const exportTab = document.getElementById("export")
const exportButton = document.getElementById("exportButton")
const newModel = document.getElementById("new-model");


input.addEventListener('change', handleFileSelect);
importButton.addEventListener('click', function () {
    input.click();
});

animate();

renderer.domElement.addEventListener('mousemove', onPointerMove, false);

renderer.domElement.addEventListener('mousedown', onPointerClick);



renderer.domElement.addEventListener('dblclick', onDoubleClick, false);

exportTab.addEventListener("click", displayModal)
exportButton.addEventListener("click", function () {
    exportMesh(Scene3D.scene);
})

newModel.onclick = () => {input.click()};

//évènement sur les points d'une face sélectionnée pour le déplacer
renderer.domElement.addEventListener('mousedown', setMouseDown);
renderer.domElement.addEventListener('mousemove', deplacerPoint);
renderer.domElement.addEventListener('mouseup', mouseUpReinitialisation);

console.log(mesh);