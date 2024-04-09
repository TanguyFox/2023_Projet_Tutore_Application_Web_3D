/**
 * Classe représentant une demi-arête
 */

/**
 * Constructeur de la classe HalfEdge
 * @param {Vertex} dep - Sommet de départ de la demi-arête
 */
export class HalfEdge {
    constructor(dep) {
        this.vertex = dep;
        this.face = null;
        this.next = null;
        this.prev = null;
        this.opposite = null;
    }
}

/**
 * Méthode permettant de récupérer le sommet de départ de la demi-arête
 * @returns {Vertex} - Sommet de départ de la demi-arête
 */
HalfEdge.prototype.headVertex = function() { return this.vertex }

/**
 * Méthode permettant de récupérer le sommet d'arrivée de la demi-arête
 * @returns {Vertex|null}
 */
HalfEdge.prototype.tailVertex = function () { return this.next.headVertex() ? this.next.headVertex() : null}

/**
 * Méthode permettant de définir la face à laquelle appartient la demi-arête
 * @param face
 */
HalfEdge.prototype.setFace = function (face){
    this.face = face;
}

/**
 * Méthode permettant de définir la demi-arête suivant la demi-arête courante
 * @returns {null|*}
 */
HalfEdge.prototype.setNext= function(next) {
    this.next = next;
}

/**
 * Méthode permettant de définir la demi-arête précédent la demi-arête courante
 * @param prev
 */
HalfEdge.prototype.setPrev = function(prev) {
    this.prev = prev;
}

/**
 * Méthode permettant de définir la demi-arête opposée (dans le sens contraire) à la demi-arête courante
 * @param opposite
 */
HalfEdge.prototype.setOpposite = function(opposite) {
    this.opposite = opposite;
}


HalfEdge.prototype.toString = function(){
    return "HE{ Départ : "  + this.headVertex() +" Arrivée : " + this.tailVertex() + " }"
}

/**
 * Méthode permettant de comparer deux demi-arêtes par rapport à leur sommet de départ
 * @param halfedge - Demi-arête à comparer
 * @returns {*}
 */
HalfEdge.prototype.compare = function(halfedge){
    return this.vertex.compare(halfedge.vertex);
}

/**
 * Méthode vérifiant si deux demi-arêtes sont les mêmes
 * @param halfedge
 * @returns {*}
 */
HalfEdge.prototype.equals = function(halfedge){
    return this.headVertex().equals(halfedge.headVertex()) && this.tailVertex().equals(halfedge.tailVertex());
}

