
import * as Scene3D from "./vue/Scene3D.js";
import {handleFileSelect} from "./controleurs/ImportSTLfileEvent";
import {animate, onPointerClick, onDoubleClick} from "./controleurs/Scene3DControleur";
import * as ToolBarEvent from "./controleurs/ToolBarEvent.js";
import * as visualisationMenu from "./controleurs/VisualisationMenu.js";
import {onPointerMove} from "./fonctionnalites/SelectionFace";
import {mesh, geometry_model, meshProblems} from "./tool/Element3DGeneraux";
import {displayModal, exportMesh} from "./fonctionnalites/ExportModel"
import * as modificationMenu from './controleurs/ModificationMenu.js';
import * as MenuContextuelControleur from "./controleurs/MenuContextuelControleur.js";
import {deplacerPoint, mouseUpReinitialisation, setMouseClick} from "./fonctionnalites/ModifCoordPoint";
import {appearMenuContextuel} from "./vue/MenuContextuel";
import {getFrontieres} from "./fonctionnalites/FrontiereTrou";
import {remplirTrouTotal} from "./fonctionnalites/RemplissageTrouCirculaire.js";



let renderer = Scene3D.initScene3D();
const importButton = document.getElementById('import');
const input = document.getElementById("inputfile");
const exportTab = document.getElementById("export")
const exportButton = document.getElementById("exportButton")
const newModel = document.getElementById("new-model");




input.addEventListener('change', async () => await handleFileSelect(input.files[0]));
importButton.addEventListener('click', function () {
    let infofichier = document.querySelector("#infoFichierProbems");
    if( infofichier !== null){
        infofichier.remove();
    }
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
renderer.domElement.addEventListener('click', setMouseClick);
renderer.domElement.addEventListener('mousemove', deplacerPoint);
renderer.domElement.addEventListener('mouseup', mouseUpReinitialisation);

//évènement du menu contextuel
renderer.domElement.addEventListener('contextmenu', appearMenuContextuel);

//évènement bouton réparation maillage
document.querySelector("#repair_button").addEventListener('click', evt => {
    console.log("eventRepair")
    remplirTrouTotal(meshProblems.getFrontieretrou());
})


console.log(mesh);