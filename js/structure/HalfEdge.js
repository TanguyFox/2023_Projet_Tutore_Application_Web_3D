export class HalfEdge {
    constructor(vertex) {
        this.vertex = vertex;
    }

    setFace(face) {
        this.face = face;
    }

    setNext(next) {
        this.next = next;
    }

    setPrev(prev) {
        this.prev = prev;
    }

    setOpposite(opposite) {
        this.opposite = opposite;
    }

}