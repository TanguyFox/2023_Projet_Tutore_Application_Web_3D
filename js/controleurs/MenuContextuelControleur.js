import {ajoutPoint} from "../fonctionnalites/AjoutPoint";

export function initEventAjPoint(){
    const menuContextuelDiv = document.querySelector("#menuContextuel");
    const boutonPoint = menuContextuelDiv.children[0].children[0];

    boutonPoint.addEventListener('click', function(){
        ajoutPoint(menuContextuelDiv);
    })
}
