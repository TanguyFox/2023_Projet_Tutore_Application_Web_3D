import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import * as Generaux from "../tool/Element3DGeneraux";


let set_String_triangles = new Set();
let set_String_lignes = new Set();

//Detecter les faces qui s'intersectent - version 2
function detecterFacesIntersectees(faces){
    console.log("detecterFacesIntersectees");
    console.log(faces);
    let boundingBox = new THREE.Box3().setFromObject(Generaux.meshModel);
    let min = boundingBox.min;
    let max = boundingBox.max;

    let divisions = calculateDivisions(faces.length);
    let subSizeX = (max.x - min.x) / divisions;
    let subSizeY = (max.y - min.y) / divisions;
    let subSizeZ = (max.z - min.z) / divisions;

    let triangles = [];
    for(let face of faces){
        let sommets = face.getTroisVertices();
        triangles.push(new THREE.Triangle(sommets[0], sommets[1], sommets[2]));
    }

    console.log(triangles);

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


    for(let triangle of triangles){
        // console.log(triangle)
        let triangleBoundingBox = new THREE.Box3().setFromPoints([triangle.a, triangle.b, triangle.c]);

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

        // console.log("startXIndex:" + startXIndex);
        // console.log("endXIndex:" + endXIndex);
        // console.log("startYIndex:" + startYIndex);
        // console.log("endYIndex:" + endYIndex);
        // console.log("startZIndex:" + startZIndex);
        // console.log("endZIndex:" + endZIndex);

        for (let x = startXIndex; x <= endXIndex; x++) {
            for (let y = startYIndex; y <= endYIndex; y++) {
                for (let z = startZIndex; z <= endZIndex; z++) {
                    subSpaces[x][y][z].push(triangle);
                }
            }
        }
    }

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

    console.log("set_triangles");
    console.log(set_String_triangles);
    console.log("set_lignes");
    console.log(set_String_lignes);

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

function intersectionTriangleEtLigne_new(triangle, line){
    let [pA, pB] = line;

    if(
        pA.equals(triangle.a) && pB.equals(triangle.b) ||
        pA.equals(triangle.a) && pB.equals(triangle.c) ||
        pA.equals(triangle.b) && pB.equals(triangle.a) ||
        pA.equals(triangle.b) && pB.equals(triangle.c) ||
        pA.equals(triangle.c) && pB.equals(triangle.a) ||
        pA.equals(triangle.c) && pB.equals(triangle.b)
    ){
        return;
    }

    let eline = plucker(pA, pB);
    let e1 = plucker(triangle.a, triangle.b);
    let e2 = plucker(triangle.b, triangle.c);
    let e3 = plucker(triangle.c, triangle.a);

    let s1 = side_operation(eline, e1);
    let s2 = side_operation(eline, e2);
    let s3 = side_operation(eline, e3);

    s1 = (s1 > 0 && s1 < 0.1) ? 0 : s1;
    s1 = (s1 < 0 && s1 > -0.1) ? 0 : s1;
    // s1 = s1 > 0 ? Math.floor(s1) : Math.ceil(s1);

    s2 = (s2 > 0 && s2 < 0.1) ? 0 : s2;
    s2 = (s2 < 0 && s2 > -0.1) ? 0 : s2;
    // s2 = s2 > 0 ? Math.floor(s2) : Math.ceil(s2);


    s3 = (s3 > 0 && s3 < 0.1) ? 0 : s3;
    s3 = (s3 < 0 && s3 > -0.1) ? 0 : s3;
    // s3 = s3 > 0 ? Math.floor(s3) : Math.ceil(s3);


    if(s1 > 0 && s2 > 0 && s3 > 0 || s1 < 0 && s2 < 0 && s3 < 0){
        console.log("=============")
        console.log("pA");
        console.log(pA);
        console.log("pB");
        console.log(pB);
        console.log("triangle");
        console.log(triangle);
        console.log("s1:" + s1);
        console.log("s2:" + s2);
        console.log("s3:" + s3);
        console.log("=============")
        // generateLineAndTriangle(triangle, line);
        generateTriangle(triangle);
    }

}

function plucker(p, q){
    let l0 = p.x * q.y - q.x * p.y;
    let l1 = p.x * q.z - q.x * p.z;
    let l2 = p.x - q.x;
    let l3 = p.y * q.z - q.y * p.z;
    let l4 = p.z - q.z;
    let l5 = q.y - p.y;
    return [l0, l1, l2, l3, l4, l5];
}

function side_operation(a, b){
    return a[0] * b[4] + a[1] * b[5] + a[2] * b[3] + a[3] * b[2] + a[4] * b[0] + a[5] * b[1];
}

//Distinguer les cas d'intersection entre deux triangles
function IntersectionEntreDeuxTriangles(triangle1, triangle2){
    let pA = triangle1.a;
    let pB = triangle1.b;
    let pC = triangle1.c;

    intersectionTriangleEtLigne(triangle2, [pA, pB])
    intersectionTriangleEtLigne(triangle2, [pB, pC])
    intersectionTriangleEtLigne(triangle2, [pC, pA])

    pA = triangle2.a;
    pB = triangle2.b;
    pC = triangle2.c;

    intersectionTriangleEtLigne(triangle1, [pA, pB])
    intersectionTriangleEtLigne(triangle1, [pB, pC])
    intersectionTriangleEtLigne(triangle1, [pC, pA])
}

function generateTriangle(triangle){
    let key_face = `${triangle.a.x},${triangle.a.y},${triangle.a.z},${triangle.b.x},${triangle.b.y},${triangle.b.z},${triangle.c.x},${triangle.c.y},${triangle.c.z}`;
    if(!set_String_triangles.has(key_face)){
        let triangleGeometry = new THREE.BufferGeometry().setFromPoints([triangle.a, triangle.b, triangle.c]);
        let triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
        let triangleG = new THREE.Mesh(triangleGeometry, triangleMaterial);
        set_String_triangles.add(key_face);
        Scene3D.scene.add(triangleG);
    }
}

//Créer une ligne et un triangle pour une intersection
function generateLineAndTriangle(triangle, line){

    let [pA, pB] = line;
    let key_ligne = `${pA.x},${pA.y},${pA.z},${pB.x},${pB.y},${pB.z}`;
    if(!set_String_lignes.has(key_ligne)){
        let direction = pB.clone().sub(pA);
        let length = direction.length();
        direction.normalize();

        let cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
        // let cylinderGeometry = new THREE.CylinderGeometry(0.005, 0.005, length, 8);
        let cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x800080 });
        let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        cylinder.position.copy(pA).add(pB).multiplyScalar(0.5);
        let axis = new THREE.Vector3(0, 1, 0).cross(direction);
        let angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(direction));
        cylinder.quaternion.setFromAxisAngle(axis.normalize(), angle);
        set_String_lignes.add(key_ligne);
        set_String_lignes.add(`${pB.x},${pB.y},${pB.z},${pA.x},${pA.y},${pA.z}`);
        Scene3D.scene.add(cylinder);
    }

    generateTriangle(triangle);
}

//Detecter si une ligne et un triangle s'intersectent
function intersectionTriangleEtLigne(triangle, line){
    const [pA, pB] = line;

    if(
        pA.equals(triangle.a) && pB.equals(triangle.b) ||
        pA.equals(triangle.a) && pB.equals(triangle.c) ||
        pA.equals(triangle.b) && pB.equals(triangle.a) ||
        pA.equals(triangle.b) && pB.equals(triangle.c) ||
        pA.equals(triangle.c) && pB.equals(triangle.a) ||
        pA.equals(triangle.c) && pB.equals(triangle.b)
    ){
        return;
    }

    let longueur = pA.distanceTo(pB);
    rayIntersects(pA, pB, triangle, longueur, 1e-3);
    rayIntersects(pB, pA, triangle, longueur, 1e-3);
}

function rayIntersects(pA, pB, triangle, longueur, tolerance){
    let ray = new THREE.Raycaster(pB, pA.clone().sub(pB).normalize());
    let intersect = ray.ray.intersectTriangle(triangle.a, triangle.b, triangle.c, false, new THREE.Vector3());
    if(intersect){
        let distance = Math.max(pA.distanceTo(intersect), pB.distanceTo(intersect));
        if(longueur > distance + tolerance){
            generateTriangle(triangle);
        }
    }
}

function calculateDivisions(nb_faces){
    let min = 4;
    let max = 100;
    let result = min + (max - min) * Math.pow(nb_faces / 200000, 0.5);
    result = Math.round(Math.min(Math.max(result, min), max));
    console.log("divisions_result: " + result);
    return result;
}

export {
    detecterFacesIntersectees
}