import {func} from "three/addons/nodes/code/FunctionNode";

export class Point{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }



}

Point.prototype.equals = function(point){
    return ((point.x === this.x)&&(point.y === this.y) && (point.z === this.z));
}

Point.prototype.compare = function (point){
    if(pointA.x !== pointB.x){
        return pointA.x - pointB.x;
    }else if(pointA.y !== pointB.y){
        return pointA.y - pointB.y;
    }else if(pointA.z !== pointB.z){
        return pointA.z - pointB.z
    }
}

Point.prototype.toString = function (){
    return 'Point{'+ this.x + ","+ this.y + ","+ this.z + "}";
}
