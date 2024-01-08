importScripts("../structure/Vertex", "../structure/HalfEdge", "../structure/Face", "../structure/Point.js", "../structure/Mesh.js")

function convertirSTLtoDonnees(positions){

    console.log("RENTREE TOOL");
    let points = [];
    let vertices = [];
    let faces = [];

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
        let x3 = positions[i+6];
        let y3 = positions[i+7];
        let z3 = positions[i+8];
        let p3 = new Point(x3, y3, z3);

        ajouterPointAListe(p1, points);
        ajouterPointAListe(p2, points);
        ajouterPointAListe(p3, points);

        let v1 = new Vertex(p1);
        let h1 = new HalfEdge(v1);
        v1.setEdge(h1);

        let v2 = new Vertex(p2);
        let h2 = new HalfEdge(v2);
        v2.setEdge(h2);

        let v3 = new Vertex(p3);
        let h3 = new HalfEdge(v3);
        v3.setEdge(h3);

        setPrevAndNext(h1, h3, h2);
        setPrevAndNext(h2, h1, h3);
        setPrevAndNext(h3, h2, h1);

        let newFace = new Face(h1);
        h1.setFace(newFace);
        h2.setFace(newFace);
        h3.setFace(newFace);

        faces.push(newFace);

        // détection des arêtes opposées pour compléter la structure de données
        detectionAretesOpposees(p1, p2, h1, "p1");
        detectionAretesOpposees(p2, p3, h2, "p2");
        detectionAretesOpposees(p3, p1, h3, "p3");

        vertices.push(v1);
        vertices.push(v2);
        vertices.push(v3);
    }

    points = trierPoints(points);
    vertices = trierVertex(vertices);
    faces = trierFaces(faces);

    console.log("Data filled")

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

function trierVertex(vertices){
    vertices.sort((a,b)=>(
        a.compare(b)
    ));
    return vertices;
}

function trierFaces(faces){
    faces.sort((a,b)=>(
        a.compare(b)
    ));
    return faces
}

function ajouterPointAListe (p, points) {
    if (!isPointInList(p, points)){
        points.push(p);
    } else {
        p = getPointInList(points, p);
    }
}

function detectionAretesOpposees(p1, p2, h, nom) {
    let vertex = vertices.filter(e => e.point.equals(p1));
        if(vertex.length !== 0){
            let halfedgeOppose = vertex.map(e => e.edge.prev).filter(e => e.vertex.point.equals(p2))[0];
            if(typeof halfedgeOppose !== 'undefined'){
                if(halfedgeOppose.opposite == null){
                    halfedgeOppose.setOpposite(h);
                    h.setOpposite(halfedgeOppose);
                }else{
                    throw new Error("Erreur de topologie p" + nom);
                }
            }
        }
}

function setPrevAndNext(h, hPrev, hNext) {
    h.setNext(hNext);
    h.setPrev(hPrev);
}

self.addEventListener("message", function (e) {
    const positions = e.data;
    const result = convertirSTLtoDonnees(positions);

    self.postMessage(result);
});
