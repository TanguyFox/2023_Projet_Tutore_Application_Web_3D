class Vertex{
    constructor(depart) {
        this.point = depart;
    }
}

Vertex.prototype.setEdge = function(edge){
    this.edge = edge;
}

Vertex.prototype.toString = function(){
    return "Vertex{ "  + this.point +" }"
}

Vertex.prototype.compare = function(vertex){
    return this.point.compare(vertex.point);
}
