import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import * as Generaux from "../tool/Element3DGeneraux";


//Detecter les faces qui s'intersectent - version 1 - A améliorer - Complexité temporelle : O(n^2) - y=C(x, 2)
// function detecterFacesIntersectees(faces) {
//
//     let triangles = [];
//     for(let face of faces){
//         let sommets = face.getSommets();
//         // console.log(sommets);
//         triangles.push(new THREE.Triangle(sommets[0], sommets[1], sommets[2]));
//     }
//
//     console.log(triangles);
//
//     for(let i = 0; i < triangles.length - 1; i++){
//         for (let j = i + 1; j < triangles.length; j++){
//             let pA = triangles[i].a;
//             let pB = triangles[i].b;
//             let pC = triangles[i].c;
//
//             intersectionTriangleEtLigne(triangles[j], [pA, pB])
//             intersectionTriangleEtLigne(triangles[j], [pB, pC])
//             intersectionTriangleEtLigne(triangles[j], [pC, pA])
//
//             pA = triangles[j].a;
//             pB = triangles[j].b;
//             pC = triangles[j].c;
//
//             intersectionTriangleEtLigne(triangles[i], [pA, pB])
//             intersectionTriangleEtLigne(triangles[i], [pB, pC])
//             intersectionTriangleEtLigne(triangles[i], [pC, pA])
//         }
//     }
// }

let set_String_triangles = new Set();
let set_String_lignes = new Set();

//Detecter les faces qui s'intersectent - version 2
function detecterFacesIntersectees(faces){
    let boundingBox = new THREE.Box3().setFromObject(Generaux.meshModel);
    let min = boundingBox.min;
    let max = boundingBox.max;

    let divisions = 4;
    let subSizeX = (max.x - min.x) / divisions;
    let subSizeY = (max.y - min.y) / divisions;
    let subSizeZ = (max.z - min.z) / divisions;

    let triangles = [];
    for(let face of faces){
        let sommets = face.getSommets();
        // console.log(sommets);
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
                    // console.log("x:" + x);
                    // console.log("y:" + y);
                    // console.log("z:" + z);
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


//Créer une ligne et un triangle pour une intersection
function generateLineAndTriangle(triangle, line){
    let [pA, pB] = line;
    let direction = pB.clone().sub(pA);
    let length = direction.length();
    direction.normalize();

    // let cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
    let cylinderGeometry = new THREE.CylinderGeometry(0.005, 0.005, length, 8);
    let cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x800080 });
    let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    cylinder.position.copy(pA).add(pB).multiplyScalar(0.5);
    let axis = new THREE.Vector3(0, 1, 0).cross(direction);
    let angle = Math.acos(new THREE.Vector3(0, 1, 0).dot(direction));
    cylinder.quaternion.setFromAxisAngle(axis.normalize(), angle);

    let key_ligne = `${pA.x},${pA.y},${pA.z},${pB.x},${pB.y},${pB.z}`;
    if(!set_String_lignes.has(key_ligne)){
        set_String_lignes.add(key_ligne);
        set_String_lignes.add(`${pB.x},${pB.y},${pB.z},${pA.x},${pA.y},${pA.z}`);
        Scene3D.scene.add(cylinder);
    }

    let triangleGeometry = new THREE.BufferGeometry().setFromPoints([triangle.a, triangle.b, triangle.c]);
    let triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
    let triangleG = new THREE.Mesh(triangleGeometry, triangleMaterial);

    let key_face = `${triangle.a.x},${triangle.a.y},${triangle.a.z},${triangle.b.x},${triangle.b.y},${triangle.b.z},${triangle.c.x},${triangle.c.y},${triangle.c.z}`;
    if(!set_String_triangles.has(key_face)){
        set_String_triangles.add(key_face);
        Scene3D.scene.add(triangleG);
    }
}

//Detecter si une ligne et un triangle s'intersectent
function intersectionTriangleEtLigne(triangle, line){
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



    let tolerance = 1e-3;
    let distance;
    let longueur = pA.distanceTo(pB);

    let ray1 = new THREE.Raycaster(pA, pB.clone().sub(pA).normalize());
    let intersect1 = ray1.ray.intersectTriangle(triangle.a, triangle.b, triangle.c, false, new THREE.Vector3());
    if(intersect1){
        distance = Math.max(pA.distanceTo(intersect1), pB.distanceTo(intersect1));
        if(longueur > distance + tolerance){
            console.log("========")
            console.log("pA")
            console.log(pA)
            console.log("pB")
            console.log(pB)
            console.log("triangle")
            console.log(triangle)
            console.log("distance: " + distance)
            console.log("longueur: " + longueur)
            console.log("intersection1");
            // console.log(intersect1);
            console.log("========")
            generateLineAndTriangle(triangle, line);
            return;
        }
    }


    let ray2 = new THREE.Raycaster(pB, pA.clone().sub(pB).normalize());
    let intersect2 = ray2.ray.intersectTriangle(triangle.a, triangle.b, triangle.c, false, new THREE.Vector3());
    if(intersect2){
        distance = Math.max(pA.distanceTo(intersect2), pB.distanceTo(intersect2));
        if(longueur > distance + tolerance){
            console.log("========")
            console.log("pA")
            console.log(pA)
            console.log("pB")
            console.log(pB)
            console.log("triangle")
            console.log(triangle)
            console.log("distance: " + distance)
            console.log("longueur: " + longueur)
            console.log("intersection2");
            // console.log(intersect2);
            console.log("========")
            generateLineAndTriangle(triangle, line);
            return;
        }
    }
}

export {
    detecterFacesIntersectees
}