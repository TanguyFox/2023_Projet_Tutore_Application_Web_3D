import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { convertirSTLtoDonnees } from './tool/DataStructureImplementation.js';
import {createBoundingBox, removeBoundingBox} from "./vue/BoundingBoxHandler";


//Scene
//------------------------------------------
const sceneContrainer = document.getElementById('scene-container');
const scene = new THREE.Scene();

//width / height Scene / a modifier temps en temps pour la Précision de RayCaster
const widthS = window.innerWidth - 300;
const heightS = window.innerHeight;
//Scene backgroud
scene.background = new THREE.Color(0x888888);
//------------------------------------------


//Camera
//------------------------------------------
const camera = new THREE.PerspectiveCamera(75, widthS / heightS, 0.1, 1000);
camera.position.set(5, 5, 10);
camera.lookAt(0 ,0, 0);
//------------------------------------------

//Renderer {antialias: false} pour améliorer la performance, le change selon les besoins
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize( widthS, heightS );


sceneContrainer.appendChild(renderer.domElement);

//Ambient Light 0x404040
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

//Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

//Grid
const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.position.set(0, 0, 0);
gridHelper.material.color.set(0x000000);
scene.add(gridHelper);


//Camera Control
const oribitcontrols = new OrbitControls(camera, renderer.domElement);

//fonction deplacement
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.addEventListener('change', render);

transformControls.addEventListener('dragging-changed', function(event){
    oribitcontrols.enabled = ! event.value;
});

scene.add(transformControls);

//Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

//Bounding Box
let boundingBoxObject = {
    boundingBox: null
};

//Raycaster function
function onPointerMove( event ){
    pointer.x = ( event.clientX / widthS ) * 2 - 1;

    /*
        +0.11 pour mieux positionner le raycaster,
        et il faut mofidier si on change la taille de scene-container,
        En gros, c'est une méthode temporaire.
    */
    pointer.y = - ( event.clientY / heightS ) * 2 + 1 + 0.11;

}

function onPointerClick( event ){

    // console.log(pointer.x + " " + pointer.y);

    let clickOnObject = false;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects( scene.children );
    // console.log(scene.children);

    if(lineModel != null){

        for(let i = 0; i < intersects.length; i ++ ){

            // console.log(intersects[i].object.uuid);
            if(intersects[i].object.uuid === lineModel.uuid){
                // console.log(intersects[i].object.uuid);
                // console.log(mesh_stl.uuid);

                //Bounding Box
                removeBoundingBox(boundingBoxObject);
                createBoundingBox(lineModel, boundingBoxObject, scene)

                transformControls.attach(lineModel);
                clickOnObject = true;
                break;
            }
        }

        if(!clickOnObject){
            removeBoundingBox(boundingBoxObject);

            if(!transformControls.dragging){
                transformControls.detach();
            }
        }

    }

}
window.addEventListener('pointermove', onPointerMove);

//A Améliorer
sceneContrainer.addEventListener('click', onPointerClick);

//Render
function render(){
    //Render page
    renderer.render(scene, camera);
}

//Animation
function animate(){
    requestAnimationFrame(animate);
    oribitcontrols.update();
    if(boundingBoxObject.boundingBox){
        boundingBoxObject.boundingBox.update();
    }
    render();
}

//STL file | Pour l'instant, on peut seulement importer un seul fichier STL, A modifier. Pour le demo, c'est suffisant.
let lineModel;

animate();





//import event 
const importButton = document.getElementById('import');
var input = document.getElementById("inputfile");
input.addEventListener('change', handleFileSelect);
importButton.addEventListener('click', function(){input.click();});



//toolbar pour Rotation, Translation, Scale
let toolbar = document.getElementById('toolbar');

//menu de modification
let menuMD = document.getElementById('menuModification');

//panel
let panel = document.getElementById('panel');

function handleFileSelect(event) {

    const file = event.target.files[0];
    if (file) {
        
        if (lineModel) {
            scene.remove(lineModel);
        }
        const stlloader = new STLLoader();
        stlloader.load(URL.createObjectURL(file), function(geometry) {

            geometry.center();
            /*let material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });

            //For binary STLs geometry might contain colors for vertices.
            if (geometry.hasColors) {
                material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
            }*/

            let wireframe = new THREE.WireframeGeometry(geometry);
            lineModel = new THREE.LineSegments(wireframe);
            lineModel.material.depthTest = false;
            lineModel.material.opacity = 0.25;
            lineModel.material.transparent = true;


            lineModel.receiveShadow = true;
            lineModel.castShadow = true;

            console.log(lineModel);

            scene.add(lineModel);
            //TODO ici
        });
    } else {
        
        if (lineModel) {
            scene.remove(lineModel);
        }
    }
    importButton.style.display = "none";
    sceneContrainer.style.display = "block";
    toolbar.style.display = "flex";
    menuMD.style.display = "block";
   // panel.style.display = "block";
}

//toolbar event
toolbar.addEventListener('click', function(event){
    console.log(event.target.id);
    if(event.target.id === "rotate"){
        transformControls.setMode("rotate");
    }
    else if(event.target.id === "translate"){
        transformControls.setMode("translate");
    }
    else if(event.target.id === "scale"){
        transformControls.setMode("scale");
    }
});

document.getElementById('grid-check').addEventListener('change', function(event){
    gridHelper.visible = event.target.checked;
});

