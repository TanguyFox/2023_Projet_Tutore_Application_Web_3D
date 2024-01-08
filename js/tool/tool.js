import { Vertex } from "../structure/Vertex";
import { HalfEdge } from "../structure/HalfEdge";
import {Face} from "../structure/Face";
import {Point} from "../structure/Point.js";
import {Mesh} from "../structure/Mesh.js";

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
        if(!isPointInList(p1, points)){
            points.push(p1);
            //console.log('ajout de ' + p1 + 'dans points');
        }else{
            p1 = getPointInList(points, p1);
            //console.log("p1 recup dans liste : " + p1);
        }

        if(!isPointInList(p2, points)){
            points.push(p2);
            //console.log('ajout de ' + p2 + 'dans points');
        }else{
            p2 = getPointInList(points, p2);
            //console.log("p2 recup dans liste : " + p2);
        }

        if(!isPointInList(p3, points)){
            points.push(p3);
            //console.log('ajout de ' + p3 + 'dans points');
        }else{
            p3 = getPointInList(points, p3);
            //console.log("p3 recup dans liste : " + p3);
        }

        let v1 = new Vertex(p1);
        let h1 = new HalfEdge(v1);
        //console.log("h1 : " + h1.toString());
        v1.setEdge(h1);

        let v2 = new Vertex(p2);
        let h2 = new HalfEdge(v2);
        //console.log("h2 : " + h2.toString());
        v2.setEdge(h2);

        let v3 = new Vertex(p3);
        let h3 = new HalfEdge(v3);
        //console.log("h3 : " + h3.toString());
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

        // détection des arêtes opposées pour compléter la structure de données
        let vertexP1 = vertices.filter(e => e.point.equals(p1));
        console.log("vertexP1 : " + vertexP1);
        if(vertexP1.length !== 0){
            let halfedgeOppose = vertexP1.map(e => e.edge.prev).filter(e => e.vertex.point.equals(p2))[0];
            console.log("halfedgeOpposee p1 : " + halfedgeOppose);
            if(typeof halfedgeOppose !== 'undefined'){
                if(halfedgeOppose.opposite == null){
                    halfedgeOppose.setOpposite(h1);
                    h1.setOpposite(halfedgeOppose);
                }else{
                    throw new Error("Erreur de topologie p1");
                }
            }
        }

        let vertexP2 = vertices.filter(e => e.point.equals(p2));
        if(vertexP2.length !== 0){
            let halfedgeOppose = vertexP2.map(e => e.edge.prev).filter(e => e.vertex.point.equals(p3))[0];
            if(typeof halfedgeOppose !== 'undefined'){
                if(halfedgeOppose.opposite == null){
                    halfedgeOppose.setOpposite(h2);
                    h2.setOpposite(halfedgeOppose);
                }else{
                    throw new Error("Erreur de topologie p2");
                }
            }
        }

        let vertexP3 = vertices.filter(e => e.point.equals(p3));
        if(vertexP3.length !== 0){
            let halfedgeOppose = vertexP3.map(e => e.edge.prev).filter(e => e.vertex.point.equals(p1))[0];
            if(typeof halfedgeOppose !== 'undefined'){
                if(halfedgeOppose.opposite == null){
                    halfedgeOppose.setOpposite(h3);
                    h3.setOpposite(halfedgeOppose);
                }else{
                    throw new Error("Erreur de topologie p3");
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

    return new Mesh(vertices, faces, points);


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


function trierPoints(points){
    points.sort((a,b) => (
        a.compare(b)
    ));
    return points;
}

function isPointInList(newPoint, pointList) {
    return pointList.some(existingPoint => existingPoint.equals(newPoint));
}

function getPointInList(list, point){
    return list.filter(e => e.equals(point))[0];
}

export {convertirSTLtoDonnees}
