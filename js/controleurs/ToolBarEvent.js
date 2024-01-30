import {transformControls} from "../vue/Scene3D";
import * as THREE from "three";

/**
 *Module gérant les évènements de la toolbar
 */

let toolbarElements = document.querySelector('#toolbar').childNodes;

//toolbar event
toolbarElements.forEach((e) => {
        if (e.nodeName === 'DIV') {
            e.addEventListener('click', eventToolbar);
        }
    }
)


function eventToolbar(event) {
    // console.log(event.target.id);
    if(transformControls.object instanceof THREE.Mesh && transformControls.object.geometry.type === "SphereGeometry"){
        transformControls.setMode("translate");
        return;
    }

    transformControls.setMode(event.target.id)
}