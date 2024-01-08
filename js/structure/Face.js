class Face {
    constructor(edge) {
        this.edge = edge;
    }
}

Face.prototype.degree = function(){
    if(this.edge == null){
        return 0;
    }
    let e = this.edge;
    let p = this.edge.next;
    let count = 1;
    while(p !== e){
        count++;
        p = p.next;
    }
    return count;
}

Face.prototype.getAdjHole = function(){
    if (this.edge === null) {
        return [];
    }
    let adj = [];
    let p = this.edge.next;
    while(p !== this.edge) {
        if(p.opposite.face === null) {
            adj.push(p.opposite.face);
        }
        p = p.next;
    }
    return adj.length;
}

Face.prototype.isWellOriented = function(){
    let h1 = this.edge;
    let p1 = h1.vertex.point;

    let h2 = h1.next;
    let p2 = h2.vertex.point;

    let h3 = h2.next;
    let p3 = h3.vertex.point;

    let crossProductX = ((p2.y - p1.y) * (p3.z - p1.z)) - ((p2.z - p1.z) * (p3.y - p1.y));
    let crossProductY = ((p2.z - p1.z) * (p3.x - p1.x)) - ((p2.x - p1.x) * (p3.z - p1.z));
    let crossProductZ = ((p2.x - p1.x) * (p3.y - p1.y)) - ((p2.y - p1.y) * (p3.x - p1.x));

    let crossProduct = crossProductX + crossProductY + crossProductZ;

    return crossProduct > 0;
}

Face.prototype.compare = function(face){
    return this.edge.compare(face.edge);
}

Face.prototype.getAdjacentes = function(){
    let faces = [];  

    let f2h1 = this.edge.opposite;
    let f2 = f2h1.face;
    faces.push(f2);
    let f1h2 = this.edge.next;   
    
    let f3h2 = f1h2.opposite;
    let f3 = f3h2.face;
    faces.push(f3);
    let f1h3 = f1h2.next;   

    let f4h3 = f1h3.opposite;
    let f4 = f4h3.face;
    faces.push(f4);
    return faces;
}

Face.prototype.has3FaceAdjacentes = function() {
    let faces = this.getAdjacentes();
    let result = false;

    if(faces.length === 3) {
        result = true;
    }

    return result;
}