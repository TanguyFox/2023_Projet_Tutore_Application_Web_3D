import * as Scene3D from "../vue/Scene3D.js";
import {handleModeSelect} from "../fonctionnalites/SelectionFace";
import {scene, gridHelper} from "../vue/Scene3D.js";
import * as generaux from "../tool/Element3DGeneraux.js";


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

    Scene3D.scene.remove(generaux.group);
    if(event.target.checked){
        //Scene3D.transformControls.detach();
        generaux.groupAsWireframe();
        Scene3D.scene.add(generaux.group);
        Scene3D.scene.remove(generaux.meshModel);
    }else{
        //generaux.setMeshModel(new THREE.Mesh(generaux.geometry_model, generaux.plainMaterial));
        //generaux.group.add(generaux.meshModel);
        //Scene3D.transformControls.detach();
        generaux.groupAsPlain();
        Scene3D.scene.add(generaux.group);
        Scene3D.scene.remove(generaux.lineModel);
    }
});