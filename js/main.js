import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import {createBoundingBox, removeBoundingBox} from "./vue/BoundingBoxHandler";
import * as loadBar from "./tool/loadBarData.js";

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

//STL file
let meshModel;

//wireframe
let lineModel;

//mesh + wireframe
let group;

//couleur de mesh
let color_mesh;

//Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

//Bounding Box
let boundingBoxObject = {
    boundingBox: null
};

let intersects = [];

//Raycaster vision
const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(), new THREE.Vector3(), 0.5, 0x00a6ff, 0.1, 0.1);

//face index
let faceIndexAncien;

let faceIndexSelected;

//Raycaster function
function onPointerMove( event ){
    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1 - 0.005;
    pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1 + 0.1;

    if(!modeFaceHtml.checked){
        return;
    }

    raycaster.setFromCamera(pointer, camera);

    intersects = raycaster.intersectObjects(scene.children, true);

    for(let i = 0; i < intersects.length; i ++ ){

        if(intersects[i].object.uuid === meshModel.uuid){
            // console.log(intersects[i]);
            let n = new THREE.Vector3();
            n.copy(intersects[i].face.normal);
            n.transformDirection(intersects[i].object.matrixWorld);
            arrowHelper.setDirection(n);
            arrowHelper.position.copy(intersects[i].point);

            if(faceIndexSelected != null){
                return;
            }

            let faceIndex = intersects[i].faceIndex;
            let geometry = intersects[i].object.geometry;
            // console.log("geometry : " + geometry);
            // let position = geometry.attributes.position.array;
            // let vertexA = new THREE.Vector3().fromArray(position, faceIndex * 3);
            // let vertexB = new THREE.Vector3().fromArray(position, faceIndex * 3 + 1);
            // let vertexC = new THREE.Vector3().fromArray(position, faceIndex * 3 + 2);
            // console.log(vertexA);
            // console.log(vertexB);
            // console.log(vertexC);

            let colorAttribute = geometry.attributes.color;

            // console.log("faceIndex : " + faceIndex);

            if(faceIndexAncien != null){
                paintFace(faceIndexAncien, colorAttribute, color_mesh)
            }

            //couleur de face
            let color = new THREE.Color(0xff0000);
            paintFace(faceIndex, colorAttribute, color);
            faceIndexAncien = faceIndex;
            break;
        }
    }

}

function onWindowResize(){
    camera.aspect = widthS / heightS;
    camera.updateProjectionMatrix();
    renderer.setSize(widthS, heightS);
    render();
}
window.addEventListener('resize', onWindowResize, false);

//check mode face
let modeFaceHtml = document.getElementById('face-mode-check');

function onPointerClick( event ){

    // console.log("x:"+pointer.x + " y:" + pointer.y);

    let clickOnObject = false;
    raycaster.setFromCamera(pointer, camera);

    intersects = raycaster.intersectObjects( scene.children );

    if(meshModel != null){

        for(let i = 0; i < intersects.length; i ++ ){

            if(intersects[i].object.uuid === meshModel.uuid){

                if(!modeFaceHtml.checked){

                    //Bounding Box
                    removeBoundingBox(boundingBoxObject);
                    createBoundingBox(meshModel, boundingBoxObject, scene)

                    transformControls.attach(group);
                    clickOnObject = true;
                    break;

                }else{

                    let colorAttribute = geometry_model.attributes.color;

                    if(faceIndexSelected != null){
                        paintFace(faceIndexSelected, colorAttribute, color_mesh)
                    }

                    faceIndexSelected = intersects[i].faceIndex;
                    let color = new THREE.Color(0xff0000);
                    paintFace(faceIndexSelected, colorAttribute, color);

                    let geometry = intersects[i].object.geometry;
                    let position = geometry.attributes.position.array;
                    let vertexA = new THREE.Vector3().fromArray(position, faceIndexSelected * 3);
                    let vertexB = new THREE.Vector3().fromArray(position, faceIndexSelected * 3 + 1);
                    let vertexC = new THREE.Vector3().fromArray(position, faceIndexSelected * 3 + 2);

                    console.log("faceIndexSelected : " + faceIndexSelected)
                    console.log(vertexA);
                    console.log(vertexB);
                    console.log(vertexC);

                    break;
                }

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

//changer la couleur d'une face
function paintFace(indexFace, colorAttributes, color){
    colorAttributes.setXYZ(indexFace * 3, color.r, color.g, color.b);
    colorAttributes.setXYZ(indexFace * 3 + 1, color.r, color.g, color.b);
    colorAttributes.setXYZ(indexFace * 3 + 2, color.r, color.g, color.b);
    colorAttributes.needsUpdate = true;
}



// window.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('mousemove', onPointerMove, false);

//A Améliorer
sceneContrainer.addEventListener('mousedown', onPointerClick);

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

//Geometry
let geometry_model;



//Utilsisation d'un WORKER pour parallelisé l'affichage du modèle 3D ainsi que le remplissage des données
//Tous les export ont été enlevés des classes pour le moment (car WORKER n'est pas compatible avec)
//Si besoin des export, il faudra qu'on regarde pour une autre solution
let dataFiller = new Worker("js/tool/DataStructureImplementation.js")

//Fonction de chargement du fichier STL
function handleFileSelect(event) {

    const file = event.target.files[0];
    if (file) {

        //S'il y a déjà un model 3D de chargé, on l'enlève
        if (group) {
            scene.remove(group);
        }

        const loadingmg = new THREE.LoadingManager()
        const stlloader = new STLLoader(loadingmg);
        try {
            stlloader.load(URL.createObjectURL(file), function (geometry) {
                loadBar.showLoadingScreen();
                geometry_model = geometry;

                // configure the color
                geometry_model.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry_model.attributes.position.count * 3), 3));

                //couleur de mesh
                color_mesh = new THREE.Color(0xFFFFFF);
                for (let i = 0; i < geometry_model.attributes.color.count; i++) {
                    geometry_model.attributes.color.setXYZ(i, color_mesh.r, color_mesh.g, color_mesh.b);
                }

                geometry_model.center();
                let material = new THREE.MeshBasicMaterial({vertexColors: true});

                let wireframe = new THREE.WireframeGeometry(geometry);

                //couleur de ligne
                lineModel = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x000000}));
                lineModel.material.depthTest = false;
                lineModel.material.opacity = 1;
                lineModel.material.transparent = true;

                meshModel = new THREE.Mesh(geometry_model, material);

                console.log(meshModel);

                group = new THREE.Group();
                group.add(meshModel, lineModel);
                scene.add(group);

                /*
                TODO : remplir la structure de données à partir de l'objet obtenu avec le STLLoader (geometry) de manière
                - relativement - rapide dans le cas où un grand nombre de points est fourni
                */
                dataFiller.postMessage(geometry.getAttribute("position").array);


                loadBar.progressBarMajworker(dataFiller);

                }
            );
        } catch (e) {
            console.log(e.message);
        }
        importButton.style.display = "none";
        sceneContrainer.style.display = "block";
        toolbar.style.display = "flex";
        menuMD.style.display = "block";
        panel.style.display = "block";

    } /*else {

        if (lineModel) {
            scene.remove(lineModel);
        }
    }*/

}
let mesh;
dataFiller.addEventListener("message", function (e) {
    mesh = e.data
    console.log(mesh)
})



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
    if(event.target.checked){
        scene.add(gridHelper);
    }else{
        scene.remove(gridHelper);
    }
});

modeFaceHtml.addEventListener('change', function(event){
    if(!modeFaceHtml.checked && scene.children.includes(arrowHelper)){
        scene.remove(arrowHelper);
        let colorAttribute = geometry_model.attributes.color;

        if(faceIndexAncien != null){
            paintFace(faceIndexAncien, colorAttribute, color_mesh);
        }

        if(faceIndexSelected != null){
            paintFace(faceIndexSelected, colorAttribute, color_mesh);
        }

        faceIndexAncien = null;
        faceIndexSelected = null;

    }else{
        scene.add(arrowHelper);
        transformControls.detach();
    }
});

function onDoubleClick(event){
    raycaster.setFromCamera(pointer, camera);
    intersects = raycaster.intersectObjects(scene.children, true);
    for(let i = 0 ; i < intersects.length; i++){

        if(intersects[i].object.uuid === meshModel.uuid){
            let target = new THREE.Vector3();
            meshModel.getWorldPosition(target);
            let newCameraPosition = target.clone().add(new THREE.Vector3(0, 0, 10));
            camera.position.copy(newCameraPosition);
            camera.lookAt(target);
            break;
        }
    }
}

//unstable
// renderer.domElement.addEventListener('dblclick', onDoubleClick, false);

export{
    renderer
}