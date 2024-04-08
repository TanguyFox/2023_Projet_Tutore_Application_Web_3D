import * as THREE from 'three';

/**
 * Module gérant l'écran de chargement
 */

// Afficher l'écran de chargement
function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'flex';
}

// Masquer l'écran de chargement
function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}

export {
    showLoadingScreen,
    hideLoadingScreen,
}
