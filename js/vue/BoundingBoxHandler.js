import * as THREE from "three";

//Not ready yet
function createBoundingBox(object, boundingBox, scene){
    boundingBox = new THREE.BoxHelper(object, 0xffff00);
    scene.add(boundingBox);
}

function removeBoundingBox(boundingBox){
    if(boundingBox && boundingBox.parent){
        boundingBox.parent.remove(boundingBox);
        boundingBox = null;
    }
}

export {createBoundingBox, removeBoundingBox}