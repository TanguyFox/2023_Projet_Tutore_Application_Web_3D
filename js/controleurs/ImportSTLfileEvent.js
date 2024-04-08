//import event
import * as loadSpin from "../tool/loadSpinnerData";
import * as THREE from "three";
import {STLLoader} from "three/addons/loaders/STLLoader";
import * as loadBar from "../tool/loadBarData";
import * as Scene3D from "../vue/Scene3D.js";
import * as generaux from "../tool/Element3DGeneraux.js";
import * as SecondScene from "../vue/SecondScene.js";
import {convertSTLToData} from "../tool/DataStructureImplementation.js";
import {boundingBoxObject, meshProblems} from "../tool/Element3DGeneraux.js";
import {removeBoundingBox} from "../vue/BoundingBoxHandler";
import {resetProblemPanel} from "../vue/ModificationMenuVue.js";
import {removeSphere} from "../fonctionnalites/AjoutPoint";
import {resetInterButton} from "./VisualisationMenu";

/**
 * module gérant l'évènement d'import d'un fichier STL
 * la méthode principale handleFileSelect charge le fichier dans la scène
 * et affiche l'élément 3D
 * * @type {HTMLElement}
 */

let menuMD = document.getElementById('menuModification'); // réference au menu de modification
let toolbar = document.getElementById('toolbar'); // toolbar pour Rotation, Translation, Scale
const importButton = document.getElementById('import'); // réference au bouton d'import du fichier STL
let secondSceneHtml = document.getElementById('scene-switch'); // réference au bouton pour passer à la deuxième scène
const stlloader = new STLLoader(); // loader pour les fichiers STL


let wireframe;


//Fonction de chargement du fichier STL
export async function handleFileSelect(file) {
    initHTML();
    if (file) {
        let filename = document.getElementById("filename")
        filename.innerHTML = file.name;
        filename.title = file.name;
        //reset the scene
        resetScene();
        loadSpin.showLoadingScreen();
        try {
            await loadFile(file);
           initStructure(file);
        } catch (e) {
            console.log(e);
        }
        //resize the scene
        window.dispatchEvent(new Event('resize'));
    }
}

async function initStructure(file) {
    const mesh = convertSTLToData(generaux.geometry_model.getAttribute("position").array)
    generaux.setMesh(mesh);
    console.log(mesh);
    meshProblems.highlightProblems();
    document.getElementById("nb_faces").textContent = mesh.faces.length;
    //document.getElementById("nb_vertex").textContent = mesh.faces.length * 3 - 1;
}

// Fonction d'initialisation de l'interface
function initHTML() {

    // On cache l'interface d'import de fichier
    let input = document.getElementById("inputfile"); // référence vers le champ d'import de fichier
    input.value = ''; // reset de la valeur du champ
    importButton.style.display = "none";

    // On affiche la scène 3D
    Scene3D.camera.position.set(5, 5, 10); //reset camera
    Scene3D.orbitcontrols.target.set(0, 0, 0);
    document.getElementById("export").style.display = "block" // affichage du bouton d'export
    document.getElementById("new-model").style.display = "block" // affichage de changement d'un noveau modèle
    Scene3D.sceneContrainer.style.display = "block";
    toolbar.style.display = "flex";
    menuMD.style.display = "block";
    secondSceneHtml.style.display = "block";

    document.getElementById("infoCoordPoints").innerHTML = "";
}

//Fonction de réparation des normales des faces
function repairFacesNormals() {
    const originalNormals = []

    // Sauvegarde des normales des faces
    for (let i = 0; i < generaux.geometry_model.attributes.normal.array.length; i += 9) {
        originalNormals.push(
            generaux.geometry_model.attributes.normal.array[i],
            generaux.geometry_model.attributes.normal.array[i + 1],
            generaux.geometry_model.attributes.normal.array[i + 2]
        );
    }

    // Recalcul des normales des faces
    generaux.geometry_model.computeVertexNormals();
    countRepairedNormalsFaces(originalNormals);
}

//Fonction de comptage des faces dont les normales ont été réparées (pour l'interface)
function countRepairedNormalsFaces(originalNormals){
    let nbChanged = 0; // Nombre de faces dont les normales ont été réparées
    let tolerance = 1e-2; // Tolerance pour la comparaison des normales

    let j = 0;

    // Comparaison des anciennes normales avec les nouvelles
    for (let i = 0; i < generaux.geometry_model.attributes.normal.array.length; i += 9) {
        if (
            Math.abs(originalNormals[j] - generaux.geometry_model.attributes.normal.array[i]) > tolerance ||
            Math.abs(originalNormals[j + 1] - generaux.geometry_model.attributes.normal.array[i + 1]) > tolerance ||
            Math.abs(originalNormals[j + 2] - generaux.geometry_model.attributes.normal.array[i + 2]) > tolerance
        ) {
            nbChanged++;
        }
        j += 3;
    }

    document.getElementById("face_mo").textContent = "" + nbChanged; // Affichage du nombre de faces dont les normales ont été réparées dans l'interface
}

//Fonction de réinitialisation de la scène
function resetScene() {

    resetProblemPanel();

    //S'il y a déjà un model 3D de chargé, on l'enlève
    if (generaux.group) {

        //reset Intersection button
        resetInterButton();

        Scene3D.transformControls.detach();
        Scene3D.scene.remove(generaux.group);
        generaux.setGroup(null);

        let modeFaceHtml = document.getElementById('face-mode-check');
        if (modeFaceHtml.checked) {
            modeFaceHtml.checked = false;
            modeFaceHtml.dispatchEvent(new Event('change'));
        }

        // Suppression de la boite englobante de l'objet 3D
        if (boundingBoxObject.boundingBox) {
            removeBoundingBox(boundingBoxObject);
        }

        //reset Deuxième scène
        SecondScene.scene.remove(SecondScene.group);
        SecondScene.setGroup(null);
    }

}

/**
 * Fonction de chargement du fichier STL
 * @param file : fichier STL à charger
 * @returns {Promise<void>}
 */

async function loadFile(file) {

    let geometry = await stlloader.loadAsync(URL.createObjectURL(file)); //chargement du fichier STL et récupération de la géométrie créer (voir THREE.BufferGeometry)
    loadSpin.hideLoadingScreen(); //on cache le spinner de chargement

    //loadBar.showProgressBar();
    generaux.setGeometryModel(geometry); //on stocke la géométrie dans la variable globale geometry_model (voir Element3DGeneraux.js)

    // Création de l'attribut couleur pour l'objet 3D
    generaux.geometry_model.setAttribute('color', new THREE.BufferAttribute(new Float32Array(generaux.geometry_model.attributes.position.count * 3), 3));

    //couleur de mesh
    generaux.setColorMesh(new THREE.Color(0xFFFFFF));
    for (let i = 0; i < generaux.geometry_model.attributes.color.count; i++) {
        generaux.geometry_model.attributes.color.setXYZ(i,
            generaux.color_mesh.r, generaux.color_mesh.g, generaux.color_mesh.b);
    }

    // On centre l'objet 3D dans la scène
    generaux.geometry_model.center();

    // On répare les normales des faces
    repairFacesNormals();

    // Création de l'objet 3D au format fil de fer
    wireframe = new THREE.WireframeGeometry(geometry);

    // Ajout de l'objet 3D dans le groupe d'objet 3D (permettant d'avoir plusieurs version de texture de l'objet 3D)
    generaux.groupAsWireframe();

    // Ajout de l'objet 3D dans la scène
    Scene3D.scene.add(generaux.group);

    //Deuxième scène
    SecondScene.scene.add(SecondScene.group);
}


export {
    wireframe,
}