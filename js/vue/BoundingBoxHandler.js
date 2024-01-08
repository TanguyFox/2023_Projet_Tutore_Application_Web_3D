import * as THREE from "three";

//Not ready yet
function createBoundingBox(object, boundingBoxObject, scene){
    let boundingBox = new THREE.BoxHelper(object, 0xffff00);
    boundingBoxObject.boundingBox = boundingBox;
    scene.add(boundingBox);
}

function removeBoundingBox(boundingBoxObject){
    if(boundingBoxObject.boundingBox && boundingBoxObject.boundingBox.parent){
        boundingBoxObject.boundingBox.parent.remove(boundingBoxObject.boundingBox);
        boundingBoxObject.boundingBox = null;
    }
}

export {createBoundingBox, removeBoundingBox}