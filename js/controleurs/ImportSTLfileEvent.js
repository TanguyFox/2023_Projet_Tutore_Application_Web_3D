//import event
import * as loadSpin from "../tool/loadSpinnerData";
import * as THREE from "three";
import {STLLoader} from "three/addons/loaders/STLLoader";
import * as loadBar from "../tool/loadBarData";
import * as Scene3D from "../vue/Scene3D.js";
import * as generaux from "../tool/Element3DGeneraux.js";
import {convertSTLToData} from "../tool/DataStructureImplementation.js";
import {boundingBoxObject} from "../tool/Element3DGeneraux.js";
import {removeBoundingBox} from "../vue/BoundingBoxHandler";


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

let wireframe;
//let material;


//Fonction de chargement du fichier STL
export function handleFileSelect(event) {

    const file = event.target.files[0];

    let input = document.getElementById("inputfile");
    input.value = '';

    if (file) {

        //S'il y a déjà un model 3D de chargé, on l'enlève
        if (generaux.group) {
            Scene3D.transformControls.detach();
            Scene3D.scene.remove(generaux.group);

            let modeFaceHtml = document.getElementById('face-mode-check');
            if(modeFaceHtml.checked){
                modeFaceHtml.checked = false;
                modeFaceHtml.dispatchEvent(new Event('change'));
            }

            if(boundingBoxObject.boundingBox){
                removeBoundingBox(boundingBoxObject);
            }

        }

        loadSpin.showLoadingScreen();

    const stlloader = new STLLoader();
        try {
            stlloader.load(URL.createObjectURL(file), function (geometry) {
                    loadSpin.hideLoadingScreen();
                    loadBar.showLoadingScreen();
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

                    wireframe = new THREE.WireframeGeometry(geometry);

                    console.log(generaux.meshModel);

                    generaux.groupAsWireframe();

                    Scene3D.scene.add(generaux.group);

                    const mesh = convertSTLToData(generaux.geometry_model.getAttribute("position").array)
                    generaux.setMesh(mesh);
                    console.log(mesh);
                    Scene3D.showSnackBar();
                    if (mesh.badHalfEdges.length > 0) {
                        console.log(mesh.badHalfEdges.length + "Problem detected")
                        mesh.highlightEdge()
                    }
                }
            );

        } catch (e) {
            console.log(e.message);
        }

        document.getElementById("export").style.display = "block"
        document.getElementById("new-model").style.display = "block"
        importButton.style.display = "none";
        Scene3D.sceneContrainer.style.display = "block";
        toolbar.style.display = "flex";
        menuMD.style.display = "block";
        //panel.style.display = "block";

        //resize the scene
        window.dispatchEvent(new Event('resize'));
    }
}


export {
    wireframe,
}