import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import * as Generaux from "../tool/Element3DGeneraux";

/**
 * Module s'occupant de la détection des faces qui s'intersectent

 */

let group_triangles;
let set_String_triangles;

//Detecter les faces qui s'intersectent - version 3
function detecterFacesIntersectees(faces){

    group_triangles = new THREE.Group();
    set_String_triangles = new Set();

    const boundingBox = new THREE.Box3().setFromObject(Generaux.meshModel);
    const min = boundingBox.min;
    const max = boundingBox.max;

    const divisions = calculateDivisions(faces.length); //Calculer le nombre de sous-espaces

    //Calculer la taille de chaque sous-espace
    const subSizeX = (max.x - min.x) / divisions;
    const subSizeY = (max.y - min.y) / divisions;
    const subSizeZ = (max.z - min.z) / divisions;

    //Initialiser les sous-espaces
    let subSpaces = new Array(divisions);
    for(let x = 0; x < divisions; x++){
        subSpaces[x] = new Array(divisions);
        for(let y = 0; y < divisions; y++){
            subSpaces[x][y] = new Array(divisions);
            for(let z = 0; z < divisions; z++){
                subSpaces[x][y][z] = [];
            }
        }
    }

    //Remplir les sous-espaces
    for(let face of faces){
        let sommets = face.getSommets();

        // créer un triangle à partir des sommets de la face
        const triangle = new THREE.Triangle(
            new THREE.Vector3(sommets[0].point.x,sommets[0].point.y,sommets[0].point.z),
            new THREE.Vector3(sommets[1].point.x,sommets[1].point.y,sommets[1].point.z),
            new THREE.Vector3(sommets[2].point.x,sommets[2].point.y,sommets[2].point.z));

        let triangleBoundingBox = new THREE.Box3().setFromPoints([triangle.a, triangle.b, triangle.c]);

        // calculer les indices des sous-espaces dans lesquels le triangle se trouve

        let startXIndex = Math.floor((triangleBoundingBox.min.x - min.x) / subSizeX);
        let endXIndex = Math.floor((triangleBoundingBox.max.x - min.x) / subSizeX);
        let startYIndex = Math.floor((triangleBoundingBox.min.y - min.y) / subSizeY);
        let endYIndex = Math.floor((triangleBoundingBox.max.y - min.y) / subSizeY);
        let startZIndex = Math.floor((triangleBoundingBox.min.z - min.z) / subSizeZ);
        let endZIndex = Math.floor((triangleBoundingBox.max.z - min.z) / subSizeZ);

        startXIndex = Math.max(0, Math.min(startXIndex, divisions - 1));
        endXIndex = Math.max(0, Math.min(endXIndex, divisions - 1));
        startYIndex = Math.max(0, Math.min(startYIndex, divisions - 1));
        endYIndex = Math.max(0, Math.min(endYIndex, divisions - 1));
        startZIndex = Math.max(0, Math.min(startZIndex, divisions - 1));
        endZIndex = Math.max(0, Math.min(endZIndex, divisions - 1));


        // ajouter le triangle à tous les sous-espaces dans lesquels il se trouve
        for (let x = startXIndex; x <= endXIndex; x++) {
            for (let y = startYIndex; y <= endYIndex; y++) {
                for (let z = startZIndex; z <= endZIndex; z++) {
                    subSpaces[x][y][z].push(triangle);
                }
            }
        }
    }

    //console.log(subSpaces)

    // parcourir tous les sous-espaces et détecter les intersections entre les triangles
    for (let x = 0; x < subSpaces.length; x++) {
        for (let y = 0; y < subSpaces[x].length; y++) {
            for (let z = 0; z < subSpaces[x][y].length; z++) {
                let subSpace = subSpaces[x][y][z];
                for(let i = 0; i < subSpace.length - 1; i++){
                    for (let j = i + 1; j < subSpace.length; j++){
                        IntersectionEntreDeuxTriangles(subSpace[i], subSpace[j]);
                    }
                }
            }
        }
    }

    // Si des intersections ont été trouvées, afficher le nombre d'intersections et activer le bouton pour les afficher
    if(set_String_triangles.size > 0){
        document.getElementById("nb_inter").textContent = set_String_triangles.size + "";
        document.getElementById("inter_button").disabled = false;
    }else{
        document.getElementById("nb_inter").textContent = "0";
        document.getElementById("inter_button").disabled = true;
    }

    // Réinitialiser les sous-espaces
    for (let x = 0; x < subSpaces.length; x++) {
        for (let y = 0; y < subSpaces[x].length; y++) {
            for (let z = 0; z < subSpaces[x][y].length; z++) {
                subSpaces[x][y][z] = null;
            }
            subSpaces[x][y] = null;
        }
        subSpaces[x] = null;
    }
    subSpaces = null;

}

//Distinguer les cas d'intersection entre deux triangles
function IntersectionEntreDeuxTriangles(triangle1, triangle2){
    if(intersectionTriangleEtLigne(triangle2, [triangle1.a, triangle1.b])){
        generateTriangle(triangle1);
        generateTriangle(triangle2);
        return;
    }

    if(intersectionTriangleEtLigne(triangle2, [triangle1.b, triangle1.c])){
        generateTriangle(triangle1);
        generateTriangle(triangle2);
        return;
    }

    if(intersectionTriangleEtLigne(triangle2, [triangle1.c, triangle1.a])){
        generateTriangle(triangle1);
        generateTriangle(triangle2);
        return;
    }

    if(intersectionTriangleEtLigne(triangle1, [triangle2.a, triangle2.b])){
        generateTriangle(triangle1);
        generateTriangle(triangle2);
        return;
    }

    if(intersectionTriangleEtLigne(triangle1, [triangle2.b, triangle2.c])){
        generateTriangle(triangle1);
        generateTriangle(triangle2);
        return;
    }

    if(intersectionTriangleEtLigne(triangle1, [triangle2.c, triangle2.a])){
        generateTriangle(triangle1);
        generateTriangle(triangle2);
    }
}

// Générer un triangle à partir d'un triangle et l'ajouter à la scène
function generateTriangle(triangle){
    let key_face = `${triangle.a.x},${triangle.a.y},${triangle.a.z},${triangle.b.x},${triangle.b.y},${triangle.b.z},${triangle.c.x},${triangle.c.y},${triangle.c.z}`;
    if(!set_String_triangles.has(key_face)){
        let triangleGeometry = new THREE.BufferGeometry().setFromPoints([triangle.a, triangle.b, triangle.c]);
        let triangleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
        let triangleG = new THREE.Mesh(triangleGeometry, triangleMaterial);
        set_String_triangles.add(key_face);
        group_triangles.add(triangleG);
    }
}


//Detecter si une ligne et un triangle s'intersectent
function intersectionTriangleEtLigne(triangle, line){
    const [pA, pB] = line;

    if(
        isVector3Equals(pA, triangle.a) ||
        isVector3Equals(pA, triangle.b) ||
        isVector3Equals(pA, triangle.c) ||
        isVector3Equals(pB, triangle.a) ||
        isVector3Equals(pB, triangle.b) ||
        isVector3Equals(pB, triangle.c)
    ){
        return false;
    }

    let plane = new THREE.Plane().setFromCoplanarPoints(triangle.a, triangle.b, triangle.c);
    let droit = new THREE.Line3(pA, pB);
    let intersectionPoint = new THREE.Vector3();
    plane.intersectLine(droit, intersectionPoint);
    if(intersectionPoint !== null){

        if(
            isVector3Equals(intersectionPoint, triangle.a) ||
            isVector3Equals(intersectionPoint, triangle.b) ||
            isVector3Equals(intersectionPoint, triangle.c) ||
            intersectionPoint.equals(new THREE.Vector3(0,0,0))
        ){
            return false;
        }

        if(triangle.containsPoint(intersectionPoint)){
            let longueur = pA.distanceTo(pB);
            let distance = Math.max(pA.distanceTo(intersectionPoint), pB.distanceTo(intersectionPoint));

            if(longueur > distance + 1e-2){
                return true;
            }
        }
    }
    return false;
}

// Calculer le nombre de divisions en fonction du nombre de faces
function calculateDivisions(nb_faces){
    let min = 4;
    let max = 100;
    let result = min + (max - min) * Math.pow(nb_faces / 200000, 0.5);
    result = Math.round(Math.min(Math.max(result, min), max));
    return result;
}

// Vérifier si deux vecteurs 3D sont égaux
function isVector3Equals(v1, v2){
    let tolerance = 1e-7;
    return Math.abs(v1.x - v2.x) < tolerance && Math.abs(v1.y - v2.y) < tolerance && Math.abs(v1.z - v2.z) < tolerance;
}

export {
    detecterFacesIntersectees,
    group_triangles
}