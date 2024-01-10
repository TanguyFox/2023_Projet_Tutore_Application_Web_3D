import * as THREE from 'three';
import {mesh, setMesh} from "./Element3DGeneraux";

/**
 * Module gérant la barre de progression du chargement des données
 */

let progressBarData = document.querySelector('#progress-barData');
let loadingMessage = document.getElementById('loading-message');
// Afficher la barre de chargement de chargement
function showLoadingScreen() {
    document.querySelector("#progressBarData").style.display = 'flex';
}

// Masquer la barre de chargement de chargement
function hideLoadingScreen() {
    document.querySelector("#progressBarData").style.display = 'none';
}


// Fonction à appeler une fois le fichier chargé
function onObjectLoad(object) {
    hideLoadingScreen();
}

/**
 * méthode qui met à jour la barre de progression en lien avec la méthode
 * convertirSTLtoDonnees
 * @param worker le job exécutant la méthode convertirSTLtoDonnees
 */
function progressBarMajworker(worker){
    worker.onmessage = function (event) {
        if (event.data.type === 'progress') {
            var percentComplete = event.data.value;
            progressBarData.style.width = percentComplete + '%';
            loadingMessage.innerHTML = 'Chargement des données... ' + Math.round(percentComplete) + '%';

            if(event.data.value === 100 ){
                hideLoadingScreen()
            }
        } else {
            setMesh(event.data);
            console.log(mesh)
        }

    }
}

export{
    showLoadingScreen,
    hideLoadingScreen,
    progressBarMajworker
}