//import event
import * as loadSpin from "../tool/loadSpinnerData";
import * as THREE from "three";
import {STLLoader} from "three/addons/loaders/STLLoader";
import * as loadBar from "../tool/loadBarData";
import * as Scene3D from "../vue/Scene3D.js";
import * as generaux from "../tool/Element3DGeneraux.js";
import {convertSTLToData} from "../tool/DataStructureImplementation.js";


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

//Utilsisation d'un WORKER pour parallelisé l'affichage du modèle 3D ainsi que le remplissage des données
//Tous les export ont été enlevés des classes pour le moment (car WORKER n'est pas compatible avec)
//Si besoin des export, il faudra qu'on regarde pour une autre solution
//let dataFiller = new Worker("js/tool/DataStructureImplementation.js");

//Fonction de chargement du fichier STL
export function handleFileSelect(event) {

    const file = event.target.files[0];
    if (file) {

        //S'il y a déjà un model 3D de chargé, on l'enlève
        if (generaux.group) {
            Scene3D.scene.remove(generaux.group);
        }

        loadSpin.showLoadingScreen();

        const loadingmg = new THREE.LoadingManager()
        const stlloader = new STLLoader(loadingmg);
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
                    let material = new THREE.MeshBasicMaterial({vertexColors: true});
                    material.transparent = true;
                    material.opacity = 0.65;

                    let wireframe = new THREE.WireframeGeometry(geometry);

                    //couleur de ligne
                    generaux.setLineModel(new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x000000})));

                    generaux.setMeshModel(new THREE.Mesh(generaux.geometry_model, material));

                    console.log(generaux.meshModel);

                    generaux.setGroup(new THREE.Group());
                    generaux.group.add(generaux.meshModel, generaux.lineModel);
                    Scene3D.scene.add(generaux.group);

                    const mesh = convertSTLToData(generaux.geometry_model.getAttribute("position").array)
                    generaux.setMesh(mesh);
                    console.log(generaux.mesh);
            }
            );

        } catch (e) {
            console.log(e.message);
        }

        console.log(generaux.mesh)
        document.getElementById("export").style.display = "block"
        importButton.style.display = "none";
        Scene3D.sceneContrainer.style.display = "block";
        toolbar.style.display = "flex";
        menuMD.style.display = "block";
        //panel.style.display = "block";
    } /*else {

        if (lineModel) {
            scene.remove(lineModel);
        }
    }*/

}

/*dataFiller.addEventListener("message", function (e) {
    //console.log("loadBar");
    loadBar.progressBarMajworker(this);
})*/


