/*
Module qui fait le tour de tous les trous et qui renvoie un tableau de tableau de points à la frontière
du trou.
 */

import Logdepthbuf_fragmentGlsl from "three/src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl";

export function getFrontiere1trou(boundaryEdgesOriginal){
    let boundaryEdges = [...boundaryEdgesOriginal];
    console.log(boundaryEdges);
    //tableau de points de ce trou
    let tabPoint = [];
    //on récupère la première H1 qui n'a pas d'opposée
    let h1 = boundaryEdges[0];
    let p1 = h1.vertex.point;
    tabPoint.push(p1);
    boundaryEdges.splice(boundaryEdges.indexOf(h1), 1);
    console.log(boundaryEdges);
    console.log(tabPoint);
    let halfedgeSansOpposeePrecedente = h1;
    let pointSuivant = h1.next.vertex.point;
    while (!pointSuivant.equals(p1)) {
        let nonOpposeHalfedge = getHalfedgeSansOpposee(halfedgeSansOpposeePrecedente);
        if(pointSuivant.equals(nonOpposeHalfedge.vertex.point)){
            //on ajoute le pointSuivant au tableau des points de frontière de trou
            tabPoint.push(pointSuivant);
            pointSuivant = nonOpposeHalfedge.next.vertex.point;
            //suppression de l'halfedge trouvee dans boundaryEdges pour ne pas le relever quand
            //on cherchera un prochain trou
            let index = boundaryEdges.indexOf(nonOpposeHalfedge);
            if(index !== -1){
                boundaryEdges.splice(index, 1);
                console.log("suppression effectuée avec succes")
            } else {
                console.log("WARNING : nonOpposeeHalfedge non trouvee dans boundaryEdges");
            }

            console.log("ETAT DES LIEUX")
            console.log(halfedgeSansOpposeePrecedente);
            console.log(nonOpposeHalfedge)
            console.log(pointSuivant)
            halfedgeSansOpposeePrecedente = nonOpposeHalfedge;
        }else {
            console.log('ERROR : le point suivant et le point de halfedge trouvee sans opposee ne coincident pas')
            throw new Error();
        }
    }

    console.log(boundaryEdges);
    console.log(tabPoint);
}

/*
fonction qui retourne la premiere halfedge sans opposée du point d'arrivée de halfedge
 */
function getHalfedgeSansOpposee(halfedge){
    let sansOpposee = false
    let halfedgeSuivante = halfedge;
    let halfedgeSansOpposee;
    while (!sansOpposee){
        halfedgeSuivante = halfedgeSuivante.next;
        if(typeof halfedgeSuivante != "undefined"){
            if(typeof halfedgeSuivante.opposite == "undefined" ||
                halfedgeSuivante.opposite == null){
                console.log("haflede sans opposee");
                console.log(halfedgeSuivante);
                halfedgeSansOpposee = halfedgeSuivante;
                sansOpposee = true;
            } else {
                halfedgeSuivante = halfedgeSuivante.opposite;
            }
        } else {
            console.log("ERREUR : halfedgeSuivante.next undefined. Non supporté par le programme")
            throw new Error();
        }

    }
    if(!sansOpposee){
        console.log('ERREUR : halfedgeSansOpposee non trouvée ')
        throw new Error();
    }
    return halfedgeSansOpposee
}