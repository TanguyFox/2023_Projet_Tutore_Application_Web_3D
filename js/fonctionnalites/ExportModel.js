import {OBJExporter, STLExporter} from "three/addons";
import {meshModel} from "../tool/Element3DGeneraux";

/**
 * Module gérant l'exportation du fichier STL
 * @type {HTMLElement}
 */


const exportModal = document.getElementById("exportModal");

// Fonction permettant d'afficher la fenêtre modale d'exportation
function displayModal() {
    exportModal.style.display = "block" // Affichage de la fenêtre modale
    let fileName = document.getElementById("filename").innerHTML; // Récupération du nom du fichier
    document.getElementById("exportedFileName").value = fileName.split(".")[0]; // Affichage du nom du fichier dans l'input

        // Fermeture de la fenêtre modale si l'utilisateur clique en dehors de celle-ci
        window.addEventListener("click", function(event) {
        if (exportModal.style.display === "block") {
            if (event.target === exportModal) {
                exportModal.style.display = "none"
            }
        }
    })
}

// Fonction permettant d'exporter le fichier STL
function exportInSTL(scene) {
    const stlExporter = new STLExporter() // Création d'un objet STLExporter (voir three.js/addons/STLExporter)
    const toBinary = document.getElementById("binary"); // Binaire ?

    // Renvoie d'un blob contenant le fichier STL
    return new Blob([stlExporter.parse(scene, {binary: toBinary.checked})]);
}

// Fonction permettant d'exporter le fichier OBJ (non utilisée)
function exportInObj(scene) {
    const objExporter = new OBJExporter();
    //let mesh = scene.children.filter(child => child.isMesh);
    return new Blob([objExporter.parse(scene)])
}

/*function exportInGLTF(scene) {
    const gltfExporter = new GLTFExporter();
    let blob;
    gltfExporter.parseAsync(scene, {binary: document.getElementById("binary").value})
        .then(content => { blob = new Blob([content], {type : "application/octet-stream"})})

    return blob;
}*/

// Fonction permettant d'exporter le fichier
// On peut l'exporter en STL ou en OBJ
function exportMesh(fileName) {
    let file;
    let newScene = meshModel;
    const fileExtension = document.getElementById("formatSelector").value // Récupération de l'extension du fichier
    switch (fileExtension) {
        case "stl" :
            file = exportInSTL(newScene);
            break;
        case "obj" :
            file = exportInObj(newScene);
            break;
        /*case "gltf" : {
            file = exportInGLTF(scene)
        }*/
    }
    createDowloadLink(file, fileExtension, fileName); // Création du lien de téléchargement à partir de l'extension du fichier et de son nom
}


function createDowloadLink(blob, extension, name) {

    const link = document.createElement("a"); // Création d'un élément <a> pour le lien de téléchargement
    link.style.display = "none"; // On cache le lien
    document.body.appendChild(link); // On ajoute le lien à la page
    link.href = URL.createObjectURL(blob); // On crée une URL pour le blob
    link.download = name.trim() === "" ? "mesh" + "." + extension : name + "." + extension; // On définit le nom du fichier
    link.click() // On simule un clic sur le lien
    document.body.removeChild(link) // On supprime le lien
}

export {
    displayModal,
    exportMesh
}