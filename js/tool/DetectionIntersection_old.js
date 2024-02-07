import * as THREE from "three";
import * as Scene3D from "../vue/Scene3D";
import * as Generaux from "../tool/Element3DGeneraux";


let set_String_triangles = new Set();
let set_String_lignes = new Set();

function detecterFacesIntersectees(faces){
    let boundingBox = new THREE.Box3().setFromObject(Generaux.meshModel);

    let initialSpace = {
        min: boundingBox.min,
        max: boundingBox.max,
        triangles: []
    }

    for(let face of faces){
        let sommets = face.getSommets();
        initialSpace.triangles.push(new THREE.Triangle(sommets[0], sommets[1], sommets[2]));
    }

    let subdividedSpaces = subdivideSpace(initialSpace);
    detectIntersectionInSubdividedSpaces(subdividedSpaces);

}

function subdivideSpace(space, depth = 0, maxDepth = 512, maxTriangle = 3000){
    if(depth >= maxDepth || space.triangles.length <= maxTriangle){
        // console.log("maxDepth:" + maxDepth);
        return [space];
    }

    let subSpaces = createSubSpace(space, depth);
    let allSubdividedSpaces = [];

    for(let triangle of space.triangles){
        let subSpaceIndices = determineSubSpaces(triangle, subSpaces);
        for(let index of subSpaceIndices){
            subSpaces[index].triangles.push(triangle);
        }
    }

    for(let subSpace of subSpaces){
        let subdividedSpaces = subdivideSpace(subSpace, depth + 1, maxDepth, maxTriangle);
        allSubdividedSpaces.push(...subdividedSpaces);
    }

    return allSubdividedSpaces;
}

function createSubSpace(space, Spacedepth){
    let subSpaces = [];
    // let divisions = Math.max(8, Spacedepth * 2);
    let divisions = 50;
    let width = (space.max.x - space.min.x) / divisions;
    let height = (space.max.y - space.min.y) / divisions;
    let depth = (space.max.z - space.min.z) / divisions;

    for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
            for (let k = 0; k < divisions; k++) {
                let subSpace = {
                    min: {
                        x: space.min.x + i * width,
                        y: space.min.y + j * height,
                        z: space.min.z + k * depth
                    },
                    max: {
                        x: space.min.x + (i + 1) * width,
                        y: space.min.y + (j + 1) * height,
                        z: space.min.z + (k + 1) * depth
                    },
                    triangles: []
                };
                subSpaces.push(subSpace);
            }
        }
    }

    return subSpaces;
}

function determineSubSpaces(triangle, subSpaces) {
    let triangleBoundingBox = new THREE.Box3().setFromPoints([triangle.a, triangle.b, triangle.c]);

    let relevantSubSpaces = [];

    for (let i = 0; i < subSpaces.length; i++) {
        let space = subSpaces[i];
        if (doesTriangleIntersectSubSpace(triangleBoundingBox, space)) {
            relevantSubSpaces.push(i);
        }
    }

    return relevantSubSpaces;
}

function doesTriangleIntersectSubSpace(triangleBoundingBox, space) {
    let intersectsX = triangleBoundingBox.min.x <= space.max.x && triangleBoundingBox.max.x >= space.min.x;
    let intersectsY = triangleBoundingBox.min.y <= space.max.y && triangleBoundingBox.max.y >= space.min.y;
    let intersectsZ = triangleBoundingBox.min.z <= space.max.z && triangleBoundingBox.max.z >= space.min.z;

    return intersectsX && intersectsY && intersectsZ;
}

function detectIntersectionInSubdividedSpaces(subdividedSpaces){
    for(let space of subdividedSpaces){
        let triangles = space.triangles;
        for(let i = 0; i < triangles.length; i++){
            for(let j = i + 1; j < triangles.length; j++) {
                IntersectionEntreDeuxTriangles(triangles[i], triangles[j]);
            }
        }
    }
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

export {
    detecterFacesIntersectees
}