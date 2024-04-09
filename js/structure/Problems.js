import {createCylinder, createTriangle, geometry_model, group, mesh, meshModel} from "../tool/Element3DGeneraux";
import {getFrontieres} from "../fonctionnalites/FrontiereTrou";
import {infoFichierMenuModif} from "../fonctionnalites/InfoFichierPb";
import {MeshConvexHull} from "../ameliorations_possible/MeshConvexHull";

/**
 * Classe permettant de gérer les problèmes de maillage
 */

export class Problems {

    /**
     * Constructeur de la classe Problems
     * @param boundaryEdges - liste des arêtes sans opposé
     */
    constructor(boundaryEdges) {
        this.boundaryEdges = boundaryEdges;
        this.newFaces = [];
        this.frontiereTrou = null;
    }
}

/**
 * INUTILISEE
 * Fonction permettant d'ajouter une nouvelle face destinée à réparer le maillage
 * @param newFace - nouvelle face
 */
Problems.prototype.addFace = function(newFace) {
    this.newFaces.push(newFace);
}

/**
 * INUTILISEE
 * Fonction permettant de récupérer les arêtes sans opposé
 * @returns {[]} - liste des arêtes sans opposé
 */
Problems.prototype.getBoundaryEdges = function() {
    return this.boundaryEdges;
}

/**
 * Fonction permettant de récupérer les trous du maillage
 * @returns {HalfEdge[]|null}
 */
Problems.prototype.getFrontieretrou = function(){
    return this.frontiereTrou;
}

/**
 * Fonction permettant de récupérer les nouvelles faces destinées à réparer le maillage
 * @returns {Face[]}
 */
Problems.prototype.getNewFaces = function() {
    return this.newFaces;
}

/**
 * Fonction permettant de mettre en évidence les problèmes de maillage
 * sur l'interface graphique
 */
Problems.prototype.highlightProblems = function() {

    // Pas de problème, rien à faire, on désactive le bouton de réparation
    if (this.boundaryEdges.length === 0) {
        document.getElementById("repair_button").disabled = true;
        return;
    }

    document.getElementById("repair_button").disabled = false;

    //let nbHoles = 0;
    let problemHE = 0;

    // Pour chaque arête sans opposé, on crée un cylindre pour la mettre en évidence
    this.boundaryEdges.forEach(edge => {
        let cylinder = createCylinder(edge);
        group.add(cylinder);
        problemHE++; // On incrémente le nombre de problèmes
    })
    this.frontiereTrou = getFrontieres(this.boundaryEdges); // On récupère les frontières des trous
    document.getElementById("nb_trous").textContent = this.frontiereTrou.length; // On met à jour le nombre de trous sur l'interface


    /* Le code ci-dessous est expérimental et n'est pas utilisé dans la version actuelle de l'application
     * Il permet de mettre en évidence les faces manquantes sans que celles-ci ne soit réellement réparées
     * Ses résultats étant peu concluants, il n'est pas utilisé mais pourrait être revu

        // Si on a 3 arêtes sans opposé, on a un trou qui peut être comblé par un seul triangle
        if (this.boundaryEdges.length === 3) {
            group.add(createTriangle(this.boundaryEdges[0].vertex, this.boundaryEdges[1].vertex, this.boundaryEdges[2].vertex));
            document.getElementById("nb_trous").textContent = "1";
        } else {

            //Sinon, on identifie les trous et on les comble

            //let holes = this.identifyHoles();

            this.frontiereTrou = getFrontieres(this.boundaryEdges); // On récupère les frontières des trous


            let triangles = this.triangulateHoles(this.frontiereTrou); // On fait la triangulation des trous
            //console.log(triangles);
            if (triangles !== undefined) {

                // On crée les triangles pour combler les trous dans l'inteface graphique
                triangles.forEach(t => {
                    let triangle = createTriangle(t[0], t[1], t[2])
                    group.add(triangle);
                })
            }

    }*/
    document.getElementById("nb_hp").innerHTML = problemHE; // On met à jour le nombre de problèmes sur l'interface
    infoFichierMenuModif(this); // On affiche dans l'interface les endroits où le maillage est problématique dans le fichier STL
}

/**
 * EXPRIMENTALE / INUTILISEE DANS LA VERSION ACTUELLE
 * Fonction permettant (en théorie) de trianguler les trous du maillage
 * Elle s'avère être mise à l'épreuve lorsque le trou est complexe
 * Elle doit être revu
 * @returns {[]}
 */
Problems.prototype.triangulateHoles = function (holes) {

    // Pas de trou, rien à faire
    if (holes.length === 0) {
        return;
    }
    
    let triangles = [];

    // Pour chaque trous, on crée des triangles pour le combler
    holes.forEach(hole => {
        let i = 0;
        while (i < hole.length-2) {
            triangles.push([hole[i], hole[i + 1], hole[i + 2]]);
            i++;
        }
        console.log(triangles);
    });

    // On met à jour le nombre de trous sur l'interface
    document.getElementById("nb_trous").textContent = holes.length;
    return triangles
}

/**
 * INUTILISEE
 * Fonction permettant de réparer le maillage
 */
Problems.prototype.repairMesh = function() {
    let model = meshModel;
    this.newFaces.forEach(face => {
        let vertices = face.getSommets();
        vertices.forEach(vertex => {
            model.getAttribute('position').array.push(vertex.x, vertex.y, vertex.z);
        });
    });
}