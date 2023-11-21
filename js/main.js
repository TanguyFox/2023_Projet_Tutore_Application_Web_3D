import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 7;

//Scene backgroud
scene.background = new THREE.Color(0x888888); 

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

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
gridHelper.rotation.x = Math.PI / 2; 
scene.add(gridHelper); 


//Render 
//Camera Control
const oribitcontrols = new OrbitControls(camera, renderer.domElement);
oribitcontrols.update();
oribitcontrols.addEventListener('change', render );

//fonction deplacement
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.addEventListener('change', render);
transformControls.addEventListener('dragging-changed', function(event){
    oribitcontrols.enabled = ! event.value;
});

scene.add(transformControls);


function render(){
    renderer.render(scene, camera);
}

render();




let mesh_stl;


//import event 
const importButton = document.getElementById('import');

var input = document.getElementById("inputfile");
input.addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0]; 
    if (file) {
        
        if (mesh_stl) {
            scene.remove(mesh_stl);
        }

        const stlloader = new STLLoader();
        stlloader.load(URL.createObjectURL(file), function(geometry) {

            let material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
            
            //For binary STLs geometry might contain colors for vertices.
            if (geometry.hasColors) {
                material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
            } 

            mesh_stl = new THREE.Mesh(geometry, material);
            mesh_stl.receiveShadow = true;
            mesh_stl.castShadow = true;
            scene.add(mesh_stl);

            //rendre objet deplacable
            transformControls.attach(mesh_stl);
            
        });
    } else {
        
        if (mesh_stl) {
            scene.remove(mesh_stl);
        }
    }
    importButton.style.display = "none";
    sceneContrainer.style.display = "block";

}


