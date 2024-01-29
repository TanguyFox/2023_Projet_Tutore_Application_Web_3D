import {initEventAjPoint} from "../controleurs/MenuContextuelControleur";
import * as Scene3DControleur from "../controleurs/Scene3DControleur";

const html = `
<div class="menuContextuel">
  <a href="#"><div id="ajPoint">Point</div></a>
  <a href="#"><div></div></a>
  <a href="#"><div></div></a>
  <a href="#"><div></div></a>
  <a href="#"><div id="suppMenuContextuel"></div></a>
</div>
`;

const menuContextuelDiv = document.querySelector("#menuContextuel");

export function appearMenuContextuel(event){
    //event.preventDefault();
    if(!Scene3DControleur.ModificationMod){
        return;
    }

    menuContextuelDiv.innerHTML = html;
    menuContextuelDiv.style.top = event.clientY + "px";
    menuContextuelDiv.style.left = event.clientX + "px";
    menuContextuelDiv.style.display = "initial";
    menuContextuelDiv.children[0].style.opacity = "1";
    menuContextuelDiv.children[0].addEventListener('click', hiddenMenuContextuel);
    initEventAjPoint();
}

menuContextuelDiv.addEventListener('mouseleave', hiddenMenuContextuel);
function hiddenMenuContextuel(){
    setTimeout(function (){
        menuContextuelDiv.innerHTML='';
        menuContextuelDiv.style.top = "120%";
        menuContextuelDiv.style.left = "120%";
        menuContextuelDiv.style.display = "none";
    }, 350);
}

