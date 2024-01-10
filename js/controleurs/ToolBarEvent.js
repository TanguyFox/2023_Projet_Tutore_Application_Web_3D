import {transformControls} from "../vue/Scene3D";

/**
 *Module gérant les évènements de la toolbar
 */

let toolbarElements = document.querySelector('#toolbar').childNodes;

//toolbar event
toolbarElements.forEach((e) => {
        if (e.nodeName === 'BUTTON') {
            e.addEventListener('click', eventToolbar);
        }
    }
)


function eventToolbar(event) {
    console.log(event.target.id);
    transformControls.setMode(event.target.id)
}