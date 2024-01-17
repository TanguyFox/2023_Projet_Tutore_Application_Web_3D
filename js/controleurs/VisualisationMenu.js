import * as Scene3D from "../vue/Scene3D.js";
import {handleModeSelect} from "../fonctionnalites/SelectionFace";
import {scene, gridHelper} from "../vue/Scene3D.js";
import * as THREE from "three";
import * as generaux from "../tool/Element3DGeneraux.js";
import {wireframe, material} from "./ImportSTLfileEvent.js";


/**
 * Module gérant les évènements liés au menu de modification, section Visualisation
 * @type {HTMLElement}
 */


//check mode face
let modeFaceHtml = document.getElementById('face-mode-check');


modeFaceHtml.addEventListener('change', handleModeSelect);

document.getElementById('grid-check').addEventListener('change', function(event){
    if(event.target.checked){
        scene.add(gridHelper);
    }else{
        scene.remove(gridHelper);
    }
});

document.getElementById('anti-aliasing-check').addEventListener('change', function(event){
    let antialiasEtat = event.target.checked;
    Scene3D.rebuildAll(antialiasEtat);
});

document.getElementById('maillage-texture-check').addEventListener('change', function(event){
    generaux.group.remove(generaux.lineModel);
    Scene3D.scene.remove(generaux.lineModel);
    generaux.group.remove(generaux.meshModel);
    Scene3D.scene.remove(generaux.meshModel);
    generaux.setLineModel(new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({color: 0x000000})));
    generaux.setMeshModel(new THREE.Mesh(generaux.geometry_model, material));
    generaux.setGroup(new THREE.Group());
    if(event.target.checked){
        generaux.group.add(generaux.lineModel);
        Scene3D.scene.add(generaux.group);
        generaux.group.remove(generaux.meshModel);
        Scene3D.scene.remove(generaux.meshModel);
    }else{
        generaux.group.add(generaux.meshModel);
        Scene3D.scene.add(generaux.group);
        generaux.group.remove(generaux.lineModel);
        Scene3D.scene.remove(generaux.lineModel);
    }
});