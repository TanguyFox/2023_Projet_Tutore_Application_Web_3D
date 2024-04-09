import * as THREE from "three";

/**
 * Module gérant les bounding box
 */

/**
 * Crée une bounding box pour un objet (utile ?)
 * @param object
 * @param boundingBoxObject
 * @param scene
 */
function createBoundingBox(object, boundingBoxObject, scene){
    let boundingBox = new THREE.BoxHelper(object, 0xffff00);
    boundingBoxObject.boundingBox = boundingBox;
    scene.add(boundingBox);
}

/**
 * Supprime la bounding box d'un objet (utile ?)
 * @param boundingBoxObject
 */
function removeBoundingBox(boundingBoxObject){
    if(boundingBoxObject.boundingBox && boundingBoxObject.boundingBox.parent){
        boundingBoxObject.boundingBox.parent.remove(boundingBoxObject.boundingBox);
        boundingBoxObject.boundingBox = null;
    }
}

export {createBoundingBox, removeBoundingBox}