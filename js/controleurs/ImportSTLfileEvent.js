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

let menuMD = document.getElementById('menuModification');
//toolbar pour Rotation, Translation, Scale
let toolbar = document.getElementById('toolbar');
const importButton = document.getElementById('import');
let secondSceneHtml = document.getElementById('scene-switch');
const stlloader = new STLLoader();

let wireframe;
//let material;


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
        await initStructure();
        //resize the scene
        window.dispatchEvent(new Event('resize'));
    }
}

async function initStructure() {
    try {
        await loadFile(file);
        const mesh = convertSTLToData(generaux.geometry_model.getAttribute("position").array)
        generaux.setMesh(mesh);
        console.log(mesh);
        meshProblems.highlightProblems();
        document.getElementById("nb_faces").textContent = mesh.faces.length;
        //document.getElementById("nb_vertex").textContent = mesh.faces.length * 3 - 1;
    } catch (e) {
        console.log(e);
    }
}

function initHTML() {
    //const file = event.target.files[0];
    let input = document.getElementById("inputfile");
    input.value = '';
    //reset camera
    Scene3D.camera.position.set(5, 5, 10);
    Scene3D.orbitcontrols.target.set(0, 0, 0);
    document.getElementById("export").style.display = "block"
    document.getElementById("new-model").style.display = "block"
    importButton.style.display = "none";
    Scene3D.sceneContrainer.style.display = "block";
    toolbar.style.display = "flex";
    menuMD.style.display = "block";
    secondSceneHtml.style.display = "block";

    document.getElementById("infoCoordPoints").innerHTML = "";
}

function repairFacesNormals() {
    const originalNormals = []
    for (let i = 0; i < generaux.geometry_model.attributes.normal.array.length; i += 9) {
        originalNormals.push(
            generaux.geometry_model.attributes.normal.array[i],
            generaux.geometry_model.attributes.normal.array[i + 1],
            generaux.geometry_model.attributes.normal.array[i + 2]
        );
    }
    // console.log(originalNormals);
    generaux.geometry_model.computeVertexNormals();
    countRepairedNormalsFaces(originalNormals);
}
function countRepairedNormalsFaces(originalNormals){
    let nbChanged = 0;
    let j = 0;
    let tolerance = 1e-2;
    for (let i = 0; i < generaux.geometry_model.attributes.normal.array.length; i += 9) {
        if (
            Math.abs(originalNormals[j] - generaux.geometry_model.attributes.normal.array[i]) > tolerance ||
            Math.abs(originalNormals[j + 1] - generaux.geometry_model.attributes.normal.array[i + 1]) > tolerance ||
            Math.abs(originalNormals[j + 2] - generaux.geometry_model.attributes.normal.array[i + 2]) > tolerance
        ) {
            nbChanged++;
            // console.log("normal changed");
            // console.log(originalNormals[j], generaux.geometry_model.attributes.normal.array[i]);
            // console.log(originalNormals[j+1], generaux.geometry_model.attributes.normal.array[i+1]);
            // console.log(originalNormals[j+2], generaux.geometry_model.attributes.normal.array[i+2]);
        }
        j += 3;
    }

    document.getElementById("face_mo").textContent = "" + nbChanged;
}

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

        if (boundingBoxObject.boundingBox) {
            removeBoundingBox(boundingBoxObject);
        }

        //Deuxième scène
        SecondScene.scene.remove(SecondScene.group);
        SecondScene.setGroup(null);
    }

}

async function loadFile(file) {

    let geometry = await stlloader.loadAsync(URL.createObjectURL(file));
    loadSpin.hideLoadingScreen();

    loadBar.showProgressBar();
    generaux.setGeometryModel(geometry);

    // configure the color
    generaux.geometry_model.setAttribute('color', new THREE.BufferAttribute(new Float32Array(generaux.geometry_model.attributes.position.count * 3), 3));

    //couleur de mesh
    generaux.setColorMesh(new THREE.Color(0xFFFFFF));
    for (let i = 0; i < generaux.geometry_model.attributes.color.count; i++) {
        generaux.geometry_model.attributes.color.setXYZ(i,
            generaux.color_mesh.r, generaux.color_mesh.g, generaux.color_mesh.b);
    }

    generaux.geometry_model.center();

    // console.log(generaux.geometry_model.attributes.normal.array);

    repairFacesNormals();

    wireframe = new THREE.WireframeGeometry(geometry);

    console.log(generaux.meshModel);

    generaux.groupAsWireframe();

    Scene3D.scene.add(generaux.group);

    //Deuxième scène
    SecondScene.scene.add(SecondScene.group);

    console.log(generaux.meshModel);
}


export {
    wireframe,
}