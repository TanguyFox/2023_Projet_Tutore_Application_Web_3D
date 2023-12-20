import { Vertex } from "../structure/Vertex";
import { HalfEdge } from "../structure/HalfEdge";
import {Face} from "../structure/Face";
import {Point} from "../structure/Point.js";

function convertirSTLtoDonnees(stl){
    console.log("RENTREE TOOL");
    let points = [];
    let vertices = [];
    let faces = [];

    let positions = stl.getAttribute("position").array;
    console.log(positions);
    // let normals = stl.geometry.attributes.normal.array;

    for(let i = 0; i < positions.length; i+=9){
        let x1 = positions[i];
        let y1 = positions[i+1];
        let z1 = positions[i+2];
        let p1 = new Point(x1, y1, z1);
        console.log("p1 : " + p1.toString());
        let x2 = positions[i+3];
        let y2 = positions[i+4];
        let z2 = positions[i+5];
        let p2 = new Point(x2, y2, z2);
        console.log("p2 : " + p2.toString());
        let x3 = positions[i+6];
        let y3 = positions[i+7];
        let z3 = positions[i+8];
        let p3 = new Point(x3, y3, z3);
        console.log("p3 : " + p3.toString());



        //A modifier apres - function includes et indexOf est null ici
        console.log("p1include : " + isPointInList(p1, points));
        if(!isPointInList(p1, points)){
            points.push(p1);
            console.log('ajout de ' + p1 + 'dans points');
        }else{
            p1 = points[points.indexOf(p1)];
        }

        console.log("p2include : " + isPointInList(p2, points));
        if(!isPointInList(p2, points)){
            points.push(p2);
            console.log('ajout de ' + p2 + 'dans points');
        }else{
            p2 = points[points.indexOf(p2)];
        }

        console.log("p3include : " + isPointInList(p3, points));
        if(!isPointInList(p3, points)){
            points.push(p3);
            console.log('ajout de ' + p3 + 'dans points');
        }else{
            p3 = points[points.indexOf(p3)];
        }

        let v1 = new Vertex(p1);
        let h1 = new HalfEdge(v1);
        v1.setEdge(h1);

        let v2 = new Vertex(p2);
        let h2 = new HalfEdge(v2);
        v2.setEdge(h2);

        let v3 = new Vertex(p3);
        let h3 = new HalfEdge(v3);
        v3.setEdge(h3);

        h1.setNext(h2);
        h1.setPrev(h3);

        h2.setPrev(h1);
        h2.setNext(h3);

        h3.setPrev(h2);
        h3.setNext(h1);

        let newFace = new Face(h1);
        h1.setFace(newFace);
        h2.setFace(newFace);
        h3.setFace(newFace);

        faces.push(newFace);

        let vertexP1 = vertices.filter(e => e.point === p1);
        if(vertexP1.length !== 0){
            let halfedgeOppose = vertexP1.map(e => e.edge.prev).filter(e => e.vertex.point === p2)[0];
            if(halfedgeOppose != null){
                if(halfedgeOppose.opposite == null){
                    halfedgeOppose.setOpposite(h1);
                    h1.setOpposite(halfedgeOppose);
                }else{
                    throw new Error("Erreur de topologie");
                }
            }
        }

        let vertexP2 = vertices.filter(e => e.point === p2);
        if(vertexP2.length !== 0){
            let halfedgeOppose = vertexP2.map(e => e.edge.prev).filter(e => e.vertex.point === p3)[0];
            if(halfedgeOppose != null){
                if(halfedgeOppose.opposite == null){
                    halfedgeOppose.setOpposite(h2);
                    h2.setOpposite(halfedgeOppose);
                }else{
                    throw new Error("Erreur de topologie");
                }
            }
        }

        let vertexP3 = vertices.filter(e => e.point === p3);
        if(vertexP3.length !== 0){
            let halfedgeOppose = vertexP3.map(e => e.edge.prev).filter(e => e.vertex.point === p1)[0];
            if(halfedgeOppose != null){
                if(halfedgeOppose.opposite == null){
                    halfedgeOppose.setOpposite(h3);
                    h3.setOpposite(halfedgeOppose);
                }else{
                    throw new Error("Erreur de topologie");
                }
            }
        }

        vertices.push(v1);
        vertices.push(v2);
        vertices.push(v3);

    }

    points = trierPoints(points);


    //TODO
    /**
     * points ← trierPoints(points)
     * //Trier vertex par points
     * //Trier face par vertex
     *
     * mesh ← Mesh(faces, vertices, points)
     * retourne mesh
     */
    // points.forEach(point => point.trierPoints(points));


}

function vertexDegree(vertex){
    let result = 0;
    let e = vertex.edge;
    let pEdge = e.next.opposite;
    while(pEdge !== e){
        pEdge = pEdge.next.opposite;
        result++;
    }
    return result + 1;
}


//A changer !
function trierPoints(points){
    /*for(let i = 0; i < points.length - 1; i++){
        let pointCourant = points[i];
        let j = i - 1;
        while(j > 0 && pointCourant.compare(points[j])){
            points[j + 1] = points[j];
            j = j - 1;
        }
        points[j + 1] = pointCourant;
    }*/
    points.sort((a,b) => (
        a.compare(b)
    ));
    return points;
}

function comparePoints(pointA, pointB){
    if(pointA.x !== pointB.x){
        return pointA.x - pointB.x;
    }else if(pointA.y !== pointB.y){
        return pointA.y - pointB.y;
    }else if(pointA.z !== pointB.z){
        return pointA.z - pointB.z
    }
}
function isPointInList(newPoint, pointList) {
    return pointList.some(existingPoint => existingPoint.equals(newPoint));
}

export {convertirSTLtoDonnees}
