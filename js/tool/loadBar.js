import * as THREE from 'three';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {RGBELoader} from "three/addons/loaders/RGBELoader";
import {renderer} from "../main";

console.log('on loadBar');

function progressBar() {

    var manager = new THREE.LoadingManager();


//debut
    /*manager.onStart = function(url, item, total){
        consol.log(`Started loading : ${url}`);
    }*/
    const progressBar = document.querySelector("#progress-bar");
//progression
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log("Progress");
        progressBar.value = (itemsLoaded / itemsTotal * 100);
        //progressBar.style.width = (itemsLoaded / itemsTotal * 100) + '%';
    };

    const progressBarContainer = document.querySelector('.progress-bar-container');

//fini
    manager.onLoad = function () {
        console.log('finished loading');
        progressBarContainer.style.display = 'none';
    }

    var Loaders = {
        Texture: new THREE.TextureLoader(manager)
    }

    const gltfLoader = new GLTFLoader(manager);
    const rgbeLoader = new RGBELoader(manager);

}

export {
    progressBar
}