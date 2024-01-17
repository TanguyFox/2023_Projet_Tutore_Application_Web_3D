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
 * @param progression le job exécutant la méthode convertirSTLtoDonnees
 */
function progressBarMaj(progression) {
    progressBarData.style.width = progression + '%';
    loadingMessage.innerHTML = 'Chargement des données... ' + Math.round(progression) + '%';
    if (progression === 100) {
        hideLoadingScreen()
    }
}

export {
    showLoadingScreen,
    hideLoadingScreen,
    progressBarMaj
}