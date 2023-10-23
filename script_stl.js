import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new STLLoader();

const fileSelector = document.getElementById('stlFile');

fileSelector.onchange = function() {
    loader.load(this.files[0], function(geometry) {
        let group = new THREE.Group();
        scene.add(group);

        var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200, wireframe: false } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 1, -0.7, -0.7 );
	    //mesh.rotation.set( 0, - Math.PI / 2, 0 );
		mesh.scale.set( 0.5, 0.5, 0.5 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );	
    });
}