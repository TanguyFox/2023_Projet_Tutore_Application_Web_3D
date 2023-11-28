import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

//Scene
const scene = new THREE.Scene();

//width / height Scene / a modifier temps en temps pour la Précision de RayCaster
const widthS = window.innerWidth;
const heightS = window.innerHeight;


//Camera
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camera = new THREE.PerspectiveCamera(75, widthS / heightS, 0.1, 1000);
camera.position.set(5, 5, 10);
camera.lookAt(0 ,0, 0);

//Scene backgroud
scene.background = new THREE.Color(0x888888); 

//Renderer {antialias: false} pour améliorer la performance, on peut le changer quand on finit le projet
const renderer = new THREE.WebGLRenderer({ antialias: false});
renderer.setSize( widthS, heightS );

const sceneContrainer = document.getElementById('scene-container');
sceneContrainer.appendChild(renderer.domElement);


//Object
// create an object need...
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );


//Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

//Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 1);
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
let boundingBox;

function createBoundingBox(object){
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.LineBasicMaterial({color: 0xffff00});
    // boundingBox = new THREE.LineSegments(geometry, material);
    // object.add(boundingBox);

    // object.geometry.computeBoundingBox();
    boundingBox = new THREE.BoxHelper(object, 0xffff00);
    scene.add(boundingBox);
}

function removeBoundingBox(){
    if(boundingBox && boundingBox.parent){
        boundingBox.parent.remove(boundingBox);
        boundingBox = null;
    }
}

function onPointerMove( event ){
    pointer.x = ( event.clientX / widthS ) * 2 - 1;

    //+0.16 pour mieux positionner le raycaster,
    // et il faut mofidier si on change la taille de scene-container,
    // En gros, c'est une méthode temporaire.
    pointer.y = - ( event.clientY / heightS ) * 2 + 1 + 0.16;

}

function onPointerClick( event ){

    // console.log(pointer.x + " " + pointer.y);
    let clickOnObject = false;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects( scene.children );
    // console.log(scene.children);

    if(mesh_stl != null){

        for(let i = 0; i < intersects.length; i ++ ){

            // console.log(intersects[i].object.uuid);
            if(intersects[i].object.uuid === mesh_stl.uuid){
                // console.log(intersects[i].object.uuid);
                // console.log(mesh_stl.uuid);

                //Bounding Box
                removeBoundingBox();
                createBoundingBox(mesh_stl)

                transformControls.attach(mesh_stl);
                clickOnObject = true;
                break;
            }
        }

        if(!clickOnObject){
            removeBoundingBox();
            transformControls.detach();
        }

    }

}
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onPointerClick);

//Render
function render(){

    //Render page
    renderer.render(scene, camera);
}

//Animation
function animate(){
    requestAnimationFrame(animate);
    oribitcontrols.update();
    if(boundingBox){
        boundingBox.update();
    }
    render();
}

//STL file | Pour l'instant, on peut seulement importer un seul fichier STL, A modifier. Pour le demo, c'est suffisant.
let mesh_stl;

animate();





//import event 
const importButton = document.getElementById('import');

var input = document.getElementById("inputfile");
input.addEventListener('change', handleFileSelect, false);

//toolbar pour Rotation, Translation, Scale
let toolbar = document.getElementById('toolbar');

function handleFileSelect(event) {
    const file = event.target.files[0]; 
    if (file) {
        
        if (mesh_stl) {
            scene.remove(mesh_stl);
        }

        const stlloader = new STLLoader();
        stlloader.load(URL.createObjectURL(file), function(geometry) {

            geometry.center();

            let material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
            
            //For binary STLs geometry might contain colors for vertices.
            if (geometry.hasColors) {
                material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
            } 

            mesh_stl = new THREE.Mesh(geometry, material);

            mesh_stl.receiveShadow = true;
            mesh_stl.castShadow = true;

            console.log(mesh_stl);//

            scene.add(mesh_stl);
        });

    } else {
        
        if (mesh_stl) {
            scene.remove(mesh_stl);
        }
    }

    importButton.style.display = "none";
    sceneContrainer.style.display = "block";
    toolbar.style.display = "block";
}

