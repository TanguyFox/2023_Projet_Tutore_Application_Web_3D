export class Point{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }



}

Point.prototype.equals = function(point){
    /*return (isCoordonneesEgales(this.x, point.x)&&
        isCoordonneesEgales(this.y, point.y) &&
        isCoordonneesEgales(this.z, point.z));

     */
    return (
        (this.x.toFixed(5)===point.x.toFixed(5))
        && (this.y.toFixed(5)===point.y.toFixed(5))
        && (this.z.toFixed(5)===point.z.toFixed(5))
    )

}

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
    return 'Point{'+ this.x + ","+ this.y + ","+ this.z + "}";
}

Point.prototype.set = function (point){
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
}


function isCoordonneesEgales(a, b){
    return Math.abs(a-b) < 1e-10;
}