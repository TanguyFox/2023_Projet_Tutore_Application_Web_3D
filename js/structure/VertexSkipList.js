/**
 * Classe représentant un noeud dans la SkipList
 */

class VertexNode {
    /**
     * Constructeur
     * @param {Point} key Clé du noeud (point du sommet)
     * @param {Vertex} value Valeur du noeud (sommet)
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.right = null;
        this.down = null;
    }
}

/**
 * Classe représentant une SkipList de sommets
 * Cette structure de données permet de stocker les sommets du graphe
 * et de les retrouver rapidement
 */
export class VertexSkipList{
    /**
     * Constructeur
     * Crée une SkipList vide
     */
    constructor() {
        this.head = new VertexNode(null, null)
        this.size = 0;
    }
}

/**
 * Méthode permettant d'insérer un sommet dans la SkipList
 * @param key - Clé du sommet (son point)
 * @param value - sommet
 */
VertexSkipList.prototype.insertVertex = function(key, value) {
    const nodes = [];
    let node = this.head;

    // On cherche le noeud le plus à droite dans la skip list
    while(node) {
        if(!node.right || node.right.key.compare(key) > 0) {
            nodes.unshift(node);
            node = node.down
        } else {
            node = node.right;
        }
    }

    let shouldPromote = true; // On tire un nombre aléatoire pour savoir si on doit promouvoir le sommet
    let downNode = null;

    // On insère le sommet dans la skip list
    while (shouldPromote && nodes.length) {
        const node = nodes.shift(); // On récupère le noeud le plus à droite
        const newNode = new VertexNode(key, value); // On crée un nouveau noeud
        newNode.down = downNode; // On relie le nouveau noeud au noeud en dessous
        newNode.right = node.right; // On relie le nouveau noeud au noeud à sa droite
        node.right = newNode // On relie le noeud à sa droite au nouveau noeud
        shouldPromote = Math.random() < 0.5; // On tire un nombre aléatoire pour savoir si on doit promouvoir le sommet
        downNode = newNode // On met à jour le noeud en dessous
    }

    // Si on doit promouvoir le sommet, on crée un nouveau niveau
    if (shouldPromote) {
        const newHead = new VertexNode(null, null); // On crée une nouvelle tête de liste
        newHead.right = new VertexNode(key, value); // On crée un nouveau noeud à droite de la tête
        newHead.right.down = downNode; // On relie le nouveau noeud à droite au noeud en dessous
        newHead.down = this.head; // On relie la nouvelle tête à la tête actuelle
        this.head = newHead // On met à jour la tête
    }
    this.size++;
}

/**
 * Méthode permettant de supprimer un sommet de la SkipList
 * @param key - Clé du sommet (son point)
 */

VertexSkipList.prototype.searchVertex = function (key) {
    let node = this.head;

    // On parcourt la skip list pour trouver le sommet
    while(node) {

        // Si le noeud ne se trouve pas au niveau actuel, on descend
        if(!node.right || node.right.key.compare(key) > 0) {
            node = node.down

            // Sinon, si le noeud est le sommet recherché, on le retourne
        } else if(node.right.key.equals(key)) {
            return node.right.value;

            // Sinon, on continue à droite
        } else {
            node = node.right;
        }
    }

    // Si on ne trouve pas le sommet, on retourne null
    return null
}

VertexSkipList.prototype.size = function () {return this.size} // Retourne la taille de la skip list

/**
 * Méthode permettant de récupérer les boundaryEdges de tous les sommets de la SkipList
 * @returns {HalfEdge[]}
 */
VertexSkipList.prototype.getHalfEdgeProblem = function() {
    const result = new Set();
    let node = this.head.down;

    // On parcourt la skip list pour récupérer les halfedges de tous les sommets
    while (node) {
        let currentNode = node.right;

        while (currentNode) {
            // Si le sommet courant a des boundaryEdges, on les ajoute à la liste
            if (currentNode.value.halfedgesTab.length > 0) {
                currentNode.value.halfedgesTab.forEach(halfedge => {
                    result.add(halfedge);
                })
            }

            // On passe au sommet suivant
            currentNode = currentNode.right;
        }

        // S'il n'y a pas de sommet suivant, on descend
        node = node.down;
    }

    // On retourne les halfedges triés par leur sommet de départ
    return Array.from(result).sort((a,b)=> a.compare(b));
}