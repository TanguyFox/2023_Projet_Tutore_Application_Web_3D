/**
 * Classe représentant un point du modèle 3D.
 */
export class Point{

    /**
     * Constructeur.
     * @param {Number} x Coordonnée x du point.
     * @param {Number} y Coordonnée y du point.
     * @param {Number} z Coordonnée z du point.
     */
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

/**
 * Méthode permettant de comparer deux points.
 * On considère que deux points sont égaux si leurs coordonnées x, y et z sont égales.
 * @param {Point} point Point à comparer.
 */
Point.prototype.equals = function(point){

    return (
        (this.x.toFixed(5)===point.x.toFixed(5))
        && (this.y.toFixed(5)===point.y.toFixed(5))
        && (this.z.toFixed(5)===point.z.toFixed(5))
    );
}

/**
 * Méthode permettant de comparer deux points de manière lexicographique.
 * @param pointB - Point à comparer.
 * @returns {number}
 */
Point.prototype.compare = function (pointB){
    if(!isCoordonneesEgales(this.x, pointB.x)){
        return this.x - pointB.x;
    }else if(!isCoordonneesEgales(this.y, pointB.y)){
        return this.y - pointB.y;
    }else if(!isCoordonneesEgales(this.z, pointB.z)){
        return this.z - pointB.z
    } else {
        return 0;
    }
}

Point.prototype.toString = function (){
    return ''+ this.x + " "+ this.y + " "+ this.z + "";
}

/**
 * Méthode permettant de copier les coordonnées d'un point dans un autre point.
 * @param {Point} point Point à copier.
 */
Point.prototype.set = function (point){
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
}

/**
 * Méthode permettant de calculer la distance entre deux points.
 * @param {Point} point Point à partir duquel on calcule la distance.
 */
Point.prototype.distance = function (point){
    // Supposons que Point a des propriétés x, y et z
    let dx = this.x - point.x;
    let dy = this.y - point.y;
    let dz = this.z - point.z;

    // Retourner la distance euclidienne entre les deux points
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

/**
 * Méthodes vériiant si deux coordonnées sont égales à 1e-10 près.
 * @param a - coordonnée (x,y ou z) du point a
 * @param b - coordonnée (x,y ou z) du point b
 * @returns {boolean}
 */
export function isCoordonneesEgales(a, b){
    return Math.abs(a-b) < 1e-10;
}