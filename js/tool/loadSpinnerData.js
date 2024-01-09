import * as THREE from 'three';

// Afficher l'écran de chargement
function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'flex';
  }
  
  // Masquer l'écran de chargement
  function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
  }
  
  var loader = new THREE.Loader();

// Fonction à appeler une fois le fichier chargé
function onObjectLoad(object) {
  // Traitez l'objet comme nécessaire
  // ...

  // Masquez l'écran de chargement une fois le traitement terminé
  hideLoadingScreen();
}

export{
    showLoadingScreen,
    hideLoadingScreen,
}
