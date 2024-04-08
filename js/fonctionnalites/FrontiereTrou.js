/**
Module qui fait le tour de tous les trous et qui renvoie un tableau de tableau de points à la frontière
du trou.
 **/

// fonction qui renvoie un tableau de tableau de points à la frontière du trou
export function getFrontieres(boundaryEdgesOriginal){
    let boundaryEdges = [...boundaryEdgesOriginal];
    let tableauxDeTrous = [];
    while (boundaryEdges.length >0){
        getFrontiere1trou(tableauxDeTrous, boundaryEdges);
    }
    return tableauxDeTrous;
}

// fonction qui renvoie un tableau de points à la frontière du trou
function getFrontiere1trou(tableauDeTrous, boundaryEdges){

    //tableau de points de ce trou
    let tabPoint = [];

    //on récupère la première H1 qui n'a pas d'opposée
    let h1 = boundaryEdges[0];

    //on ajoute le point de départ au tableau des points de frontière de trou
    let v1 = h1.vertex;
    tabPoint.push(v1);

    //on supprime h1 de boundaryEdges
    boundaryEdges.splice(boundaryEdges.indexOf(h1), 1);

    let halfedgeSansOpposeePrecedente = h1;
    let vertexSuivant = h1.next.vertex;

    //tant que le point suivant n'est pas le point de départ
    while (!vertexSuivant.equals(v1)) {

        //on récupère l'halfedge suivante qui n'a pas d'opposée
        let nonOpposeHalfedge = getHalfedgeSansOpposee(halfedgeSansOpposeePrecedente);

        //si le point suivant est le point de l'halfedge trouvée sans opposée
        if(vertexSuivant.equals(nonOpposeHalfedge.vertex)){

            //on ajoute le pointSuivant au tableau des points de frontière de trou
            if(tabPoint.includes(vertexSuivant)){
                let newTrous = tabPoint.splice(tabPoint.indexOf(vertexSuivant));
                console.log("WARNING : newtrou", newTrous);
                tableauDeTrous.push(newTrous);
            }
            tabPoint.push(vertexSuivant);
            vertexSuivant = nonOpposeHalfedge.next.vertex;
            //suppression de l'halfedge trouvee dans boundaryEdges pour ne pas le relever quand
            //on cherchera un prochain trou
            let index = boundaryEdges.indexOf(nonOpposeHalfedge);
            if(index !== -1){
                boundaryEdges.splice(index, 1);
                //console.log("suppression effectuée avec succes")
            } else {
                console.log("WARNING : nonOpposeeHalfedge non trouvee dans boundaryEdges");
            }
            halfedgeSansOpposeePrecedente = nonOpposeHalfedge;
        }else {
            console.log('ERROR : le point suivant et le point de halfedge trouvee sans opposee ne coincident pas')
            throw new Error();
        }
    }
    tabPoint.reverse();
    tableauDeTrous.push(tabPoint);
}

/*
fonction qui retourne la premiere halfedge sans opposée du point d'arrivée de halfedge
 */
function getHalfedgeSansOpposee(halfedge){

    let sansOpposee = false
    let halfedgeSuivante = halfedge;
    let halfedgeSansOpposee;

    // on cherche la première halfedge sans opposée
    while (!sansOpposee){
        halfedgeSuivante = halfedgeSuivante.next;

        // si l'halfedge suivante n'a pas d'opposée on l'a trouve
        if(typeof halfedgeSuivante !== null){
            if(halfedgeSuivante.opposite == null){
                halfedgeSansOpposee = halfedgeSuivante;
                sansOpposee = true;

            // si l'halfedge suivante a une opposée on continue la recherche
            } else {
                halfedgeSuivante = halfedgeSuivante.opposite;
            }
        // si l'halfedge suivante est null on a un problème
        } else {
            console.log("ERREUR : halfedgeSuivante.next undefined. Non supporté par le programme")
            throw new Error();
        }

    }

    // si on n'a pas trouvé d'halfedge sans opposée on a un problème
    if(!sansOpposee){
        console.log('ERREUR : halfedgeSansOpposee non trouvée ')
        throw new Error();
    }
    return halfedgeSansOpposee
}

