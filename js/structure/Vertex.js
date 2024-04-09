/**
 * Classe représentant un sommet du maillage 3D
 */
export class Vertex {

    /**
     * Constructeur
     * @param {Point} depart
     */
    constructor(depart) {
        this.point = depart;
        this.halfedgesTab = [];
    }
}

Vertex.prototype.toString = function () {
    return "Vertex{ " + this.point + " }"
}

/**
 * Méthode de comparaison de deux sommets par rapport à leur point
 * @param vertex - le sommet à comparer
 * @returns {*|number}
 */
Vertex.prototype.compare = function (vertex) {
    return this.point.compare(vertex.point);
}

/**
 * Méthode permettant de récupérer les demi-arêtes incidentes à ce sommet
 * @returns {Array} - les demi-arêtes incidentes
 */
Vertex.prototype.addHalfEdge = function (he) {

    // On vérifie si la demi-arête est opposée à une autre demi-arête
    let opp = he.tailVertex().halfedgesTab.find(halfedge => halfedge.tailVertex() === this)

    // Si c'est le cas, on met à jour les demi-arêtes opposées
    if (opp !== undefined) {
        he.setOpposite(opp)
        opp.setOpposite(he)

        // On supprime la demi-arête opposée de la liste des demi-arêtes incidentes du sommet
        opp.headVertex().halfedgesTab.splice(opp.headVertex().halfedgesTab.indexOf(opp), 1)
    } else {
        // Sinon, on ajoute la demi-arête à la liste des demi-arêtes incidentes du sommet
        this.halfedgesTab.push(he)
    }
}

/**
 * Méthode permettant de vérifier l'égalité de deux sommets
 * @param vertex - le sommet à comparer
 * @returns {boolean}
 */
Vertex.prototype.equals = function (vertex) {
    return this.point.compare(vertex.point) === 0;
}