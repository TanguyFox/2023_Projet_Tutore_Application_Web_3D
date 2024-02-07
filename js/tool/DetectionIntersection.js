import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import * as Generaux from "../tool/Element3DGeneraux";


let set_String_triangles = new Set();
let set_String_lignes = new Set();

//Detecter les faces qui s'intersectent - version 2
function detecterFacesIntersectees(faces){
    let boundingBox = new THREE.Box3().setFromObject(Generaux.meshModel);
    let min = boundingBox.min;
    let max = boundingBox.max;

    let divisions = calculateDivisions(faces.length);
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
    console.log("subSpaces");
    console.log(subSpaces);

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
    s2 = (s2 > 0 && s2 < 0.1) ? 0 : s2;
    s2 = (s2 < 0 && s2 > -0.1) ? 0 : s2;
    s3 = (s3 > 0 && s3 < 0.1) ? 0 : s3;
    s3 = (s3 < 0 && s3 > -0.1) ? 0 : s3;

    if(s1 > 0 && s2 > 0 && s3 > 0 || s1 < 0 && s2 < 0 && s3 < 0){
        console.log("=============")
        console.log("s1:" + s1);
        console.log("s2:" + s2);
        console.log("s3:" + s3);
        console.log("=============")
        generateLineAndTriangle(triangle, line);
    }

}

function plucker(a, b){
    let l0 = a.x * b.y - b.x * a.y;
    let l1 = a.x * b.z - b.x * a.z;
    let l2 = a.x - b.x;
    let l3 = a.y * b.z - b.y * a.z;
    let l4 = a.z - b.z;
    let l5 = b.y - a.y;
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

    intersectionTriangleEtLigne_new(triangle2, [pA, pB])
    intersectionTriangleEtLigne_new(triangle2, [pB, pC])
    intersectionTriangleEtLigne_new(triangle2, [pC, pA])

    pA = triangle2.a;
    pB = triangle2.b;
    pC = triangle2.c;

    intersectionTriangleEtLigne_new(triangle1, [pA, pB])
    intersectionTriangleEtLigne_new(triangle1, [pB, pC])
    intersectionTriangleEtLigne_new(triangle1, [pC, pA])
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
            // console.log("========")
            // console.log("pA")
            // console.log(pA)
            // console.log("pB")
            // console.log(pB)
            // console.log("triangle")
            // console.log(triangle)
            // console.log("distance: " + distance)
            // console.log("longueur: " + longueur)
            // console.log("intersection1");
            // // console.log(intersect1);
            // console.log("========")
            generateLineAndTriangle(triangle, line);
            return;
        }
    }


    let ray2 = new THREE.Raycaster(pB, pA.clone().sub(pB).normalize());
    let intersect2 = ray2.ray.intersectTriangle(triangle.a, triangle.b, triangle.c, false, new THREE.Vector3());
    if(intersect2){
        distance = Math.max(pA.distanceTo(intersect2), pB.distanceTo(intersect2));
        if(longueur > distance + tolerance){
            // console.log("========")
            // console.log("pA")
            // console.log(pA)
            // console.log("pB")
            // console.log(pB)
            // console.log("triangle")
            // console.log(triangle)
            // console.log("distance: " + distance)
            // console.log("longueur: " + longueur)
            // console.log("intersection2");
            // // console.log(intersect2);
            // console.log("========")
            generateLineAndTriangle(triangle, line);
            return;
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