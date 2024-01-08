class Point{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }



}

Point.prototype.equals = function(point){
    return ((point.x === this.x)&&(point.y === this.y) && (point.z === this.z));
}

Point.prototype.compare = function (pointB){
    if(this.x !== pointB.x){
        return this.x - pointB.x;
    }else if(this.y !== pointB.y){
        return this.y - pointB.y;
    }else if(this.z !== pointB.z){
        return this.z - pointB.z
    }
}

Point.prototype.toString = function (){
    return 'Point{'+ this.x + ","+ this.y + ","+ this.z + "}";
}
