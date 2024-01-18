import {OBJExporter, STLExporter} from "three/addons";
import * as THREE from "three";

const exportModal = document.getElementById("exportModal");
//const exportButton = document.getElementById("exportButton");



function displayModal() {
    exportModal.style.display = "block"
    window.addEventListener("click", function(event) {
        if (exportModal.style.display === "block") {
            if (event.target === exportModal) {
                exportModal.style.display = "none"
            }
        }
    })
}

function exportInSTL(scene) {
    const stlExporter = new STLExporter()
    const toBinary = document.getElementById("binary");
    console.log("binaire ? : " + toBinary.checked)
    return new Blob([stlExporter.parse(scene, {binary: toBinary.checked})]);
}

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

function exportMesh(scene) {
    let file;
    let newScene = clearScene(scene)
    const fileExtension = document.getElementById("formatSelector").value
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
    createDowloadLink(file, fileExtension);
}

function createDowloadLink(blob, extension) {

    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = "mesh." + extension
    link.click()
    document.body.removeChild(link)
}

function clearScene(scene) {
    let sceneToExport = new THREE.Scene();
   scene.traverse(child => {
       if (child.isGroup) {
           sceneToExport.add(child)
       }
   })
    return sceneToExport
}

export {
    displayModal,
    exportMesh
}