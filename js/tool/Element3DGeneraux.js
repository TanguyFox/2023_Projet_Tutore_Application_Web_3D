/**
 * module répertoriant tous les éléments de l'objet 3D susceptibles d'être utilisés dans d'autres
 * modules et nécessitant une seule instance
 */

//STL file
let meshModel;
//Geometry
let geometry_model;

//couleur de mesh
let color_mesh;

//wireframe
let lineModel;
//mesh + wireframe
let group;
//Bounding Box
let boundingBoxObject = {
    boundingBox: null
};

//Maillage en données
let mesh;

let faceIndexSelected;
let faceIndexAncien;

function setGeometryModel(geometry){
    geometry_model = geometry;
}

function setColorMesh(colorMesh){
    color_mesh = colorMesh;
}

function setLineModel(lineModelsetter){
    lineModel = lineModelsetter;
}

function setMeshModel(meshModelSetter){
    meshModel = meshModelSetter
}

function setGroup(groupsetter){
    group = groupsetter;
}

function setFaceIndexSelected(valeur){
    faceIndexSelected=valeur;
}
function setFaceIndexAncien(valeur){
    faceIndexAncien=valeur;
}
function setMesh(newMesh){
    mesh=newMesh;
}

export {
    geometry_model,
    color_mesh,
    lineModel,
    group,
    meshModel,
    boundingBoxObject,
    faceIndexSelected,
    faceIndexAncien,
    mesh,
    setGeometryModel,
    setColorMesh,
    setLineModel,
    setMeshModel,
    setGroup,
    setFaceIndexSelected,
    setFaceIndexAncien,
    setMesh
}