import * as THREE from "three";
import {
    afficherPoints3D,
    afficherSingleCoordPoint,
    afficherSinglePoint3d,
    setTransformedPosition
} from "./SelectionFace";
import {intersects} from "../controleurs/Scene3DControleur";
import * as Generaux from "../tool/Element3DGeneraux";
import * as Scene3D from "../vue/Scene3D";
import * as Raycaster from "../tool/Raycaster";
import {int} from "three/nodes";
import {initEventInputCoord} from "../controleurs/ModificationMenu";
import {geometry_model, groupAsWireframe, mesh} from "../tool/Element3DGeneraux";
import {Point} from "../structure/Point";
import {majEdges} from "./ModifCoordPoint";
import {camera} from "../vue/Scene3D";
import * as generaux from "../tool/Element3DGeneraux";



export function ajoutPoint(menuContextuel){
    let sphere = ajPoint3D();
    afficherSingleCoordPoint('', sphere, sphere.position, "#ffff00");
    //initEventInputCoord();
    remplirStructureDeDonnees(sphere.position);
}

/**
 * méthode ajoutant un point jaune dans le plan 3D à l'endroit du pointeur
 */
function ajPoint3D(){

    let mouse = {x : 0, y : 0};
    mouse.x = Raycaster.pointer.x;
    mouse.y = Raycaster.pointer.y;

    // Utilisez la fonction unproject pour convertir les coordonnées de l'écran en coordonnées de la scène en 3D
    Raycaster.raycaster.setFromCamera(Raycaster.pointer, Scene3D.camera);

    // Obtenez la liste des objets intersectés
    let intersects = Raycaster.raycaster.intersectObjects(Scene3D.scene.children, true);

    let isObject = false;

    // Créez une nouvelle sphère à la position du clic
    let geometry = new THREE.SphereGeometry(0.1, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    let sphere = new THREE.Mesh(geometry, material);

    for(let i = 0; i < intersects.length; i ++ ){

        if(intersects[i].object.uuid === Generaux.meshModel.uuid){
            console.log(intersects[i]);
            isObject = true;

            sphere.position.copy(intersects[i].point);
            break;
        }
    }

    if(!isObject){
        Generaux.meshModel.geometry.computeBoundingBox();
        let localCenter = new THREE.Vector3();
        Generaux.meshModel.geometry.boundingBox.getCenter(localCenter);
        let worldCenter = Generaux.meshModel.localToWorld(localCenter);

        let planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), -worldCenter.y);
        let intersectPoint = new THREE.Vector3();
        Raycaster.raycaster.ray.intersectPlane(planeY, intersectPoint);
        sphere.position.copy(intersectPoint);
    }

    Scene3D.scene.add(sphere);
    console.log(sphere.uuid)
    console.log(Scene3D.scene)

    majBufferGeometry(sphere.position);
    return sphere;
}

function majBufferGeometry(coordonnees){
    let positionAttribute = geometry_model.attributes.position;
    console.log(geometry_model.attributes.position)
    let positions = Array.from(positionAttribute.array);
    console.log(positions)
    positions.push(coordonnees.x);
    positions.push(coordonnees.y);
    positions.push(coordonnees.z);

    /*
    Il faut rentrer trois points sinon ça bug ! donc je dois trouver les points les plus proches au nouveau
    point avant de mettre à jour la structure
     */


    /*let newPositions = new Float32Array([
        ...positionAttribute.array,
        coordonnees.x,
        coordonnees.y,
        coordonnees.z
    ]);*/
    console.log(positions)
    geometry_model.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
    console.log(geometry_model);

    geometry_model.computeBoundingSphere(); // Recalcul du sphere de la bounding box
    geometry_model.computeBoundingBox(); // Recalcul de la bounding box
    //geometry_model.computeFaceNormals(); // Recalcul des normales des faces
    geometry_model.computeVertexNormals();
    geometry_model.attributes.position.needsUpdate = true;
    let hasNaN = geometry_model.attributes.position.array.some(isNaN);
    if (hasNaN) {
        console.error('Les données de position contiennent des valeurs NaN.');
    }
    majEdges();
}

function remplirStructureDeDonnees(coordonnees){
    //trouver les trois points les plus proches
    let newPoint = new Point(coordonnees.x, coordonnees.y, coordonnees.z);
    let troisPoints = [];
    let faces = mesh.faces;
    faces.forEach((uneFace) => {

    })
}
