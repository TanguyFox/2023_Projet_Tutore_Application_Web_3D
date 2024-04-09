import * as Scene3D from "./vue/Scene3D.js";
import {handleFileSelect} from "./controleurs/ImportSTLfileEvent";
import {onPointerClick, onDoubleClick} from "./controleurs/Scene3DControleur";
import {onPointerMove} from "./fonctionnalites/SelectionFace";
import {mesh, meshProblems} from "./tool/Element3DGeneraux";
import {displayModal, exportMesh} from "./fonctionnalites/ExportModel"
import {deplacerPoint, mouseUpReinitialisation, setMouseClick} from "./fonctionnalites/ModifCoordPoint";
import {appearMenuContextuel} from "./vue/MenuContextuel";
import {remplirTrouTotal} from "./fonctionnalites/RemplissageTrouCirculaire.js";
import {animate_VR} from "./fonctionnalites/VR";



let renderer = Scene3D.initScene3D();
const importButton = document.getElementById('import');
const input = document.getElementById("inputfile");
const exportTab = document.getElementById("export")
const exportButton = document.getElementById("exportButton")
const newModel = document.getElementById("new-model");



// évènement pour importer un fichier
input.addEventListener('change', async () => await handleFileSelect(input.files[0]));

//
importButton.addEventListener('click', function () {
    let infofichier = document.querySelector("#infoFichierProblems");
    if( infofichier !== null){
        infofichier.remove();
    }
    input.click();
});

animate_VR();

renderer.domElement.addEventListener('mousemove', onPointerMove, false);

renderer.domElement.addEventListener('mousedown', onPointerClick);


renderer.domElement.addEventListener('dblclick', onDoubleClick, false);

//évènement pour ouvrir la fenêtre d'exportation
exportTab.addEventListener("click", displayModal)

//évènement pour exporter le fichier
exportButton.addEventListener("click", function () {
    exportMesh(document.getElementById("exportedFileName").value);
})

//évènement pour ouvrir la fenêtre de sélection d'un nouveau fichier
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