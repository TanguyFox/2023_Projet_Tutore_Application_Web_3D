import {Vertex} from "../structure/Vertex.js"
import {HalfEdge} from "../structure/HalfEdge.js"
import {Face} from "../structure/Face.js"
import {Point} from "../structure/Point.js"
import {Mesh} from "../structure/Mesh.js"
import {VertexSkipList} from "../structure/VertexSkipList.js"
import {progressBarMaj} from "./loadBarData";


export function convertSTLToData(positions) {

    const sommets = new VertexSkipList();
    const faces = []
    //let halfedges = []

    console.time("Data filling")
    console.log("nbFaces : " + positions.length / 9)
    for (let i = 0; i < positions.length; i += 9) {

        const currentVertices = [
            creerSommet(new Point(positions[i], positions[i + 1], positions[i + 2]), sommets),
            creerSommet(new Point(positions[i + 3], positions[i + 4], positions[i + 5]), sommets),
            creerSommet(new Point(positions[i + 6], positions[i + 7], positions[i + 8]), sommets)
        ]

        const halfedges = currentVertices.map(v => new HalfEdge(v))
        halfedges.forEach((h, index) => setPrevAndNext(h, halfedges[(index + 2) % 3], halfedges[(index + 1) % 3]))


        currentVertices.forEach((vertex, index) => {
            vertex.addHalfEdge(halfedges[index])
        })

        const face = new Face(halfedges[0]);
        halfedges.forEach(he => he.setFace(face))
        //getOppositeEdge(face)

        faces.push(face);
        const progression = (i / positions.length) * 100;
        if (Math.round(progression) % 10 === 0) progressBarMaj(progression)

    }
    console.timeEnd("Data filling")
    const badHalfedges = sommets.getHalfEdgeProblem()
    progressBarMaj(100)

    return new Mesh(faces, badHalfedges);
}

function creerSommet(point, sommets) {
    let existingVertex = sommets.searchVertex(point)
    if (existingVertex === null) {
        existingVertex = new Vertex(point)
        sommets.insertVertex(point, existingVertex)
    }
    return existingVertex
}

function setPrevAndNext(h, hPrev, hNext) {
    h.setNext(hNext);
    h.setPrev(hPrev);
}

/*
function convertirSTLtoDonnees(positions) {
    console.log("RENTREE TOOL");
    let points = [];
    let vertices = [];
    let faces = [];
    var totalSize = positions.length;
    for (let i = 0; i < totalSize; i += 9) {
        progression(i, totalSize);


        console.time("création des 3 points")
        let x1 = positions[i];
        let y1 = positions[i + 1];
        let z1 = positions[i + 2];
        let p1 = new Point(x1, y1, z1);
        // console.log("p1 : " + p1.toString());
        let x2 = positions[i + 3];
        let y2 = positions[i + 4];
        let z2 = positions[i + 5];
        let p2 = new Point(x2, y2, z2);

        let x3 = positions[i + 6];
        let y3 = positions[i + 7];
        let z3 = positions[i + 8];
        let p3 = new Point(x3, y3, z3);
        console.timeEnd("création des 3 points")

        ajouterPointAListe(p1, points);
        ajouterPointAListe(p2, points);
        ajouterPointAListe(p3, points);

        console.time("création du triangle")
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
        console.timeEnd("création du triangle");


        let newFace = new Face(h1);
        h1.setFace(newFace);
        h2.setFace(newFace);
        h3.setFace(newFace);

        faces.push(newFace);

        // détection des arêtes opposées pour compléter la structure de données
        console.time("detection p1");
        detectionAretesOpposees(vertices, p1, p2, h1, "p1");
        console.timeEnd("detection p1");
        console.time("detection p2");
        detectionAretesOpposees(vertices, p2, p3, h2, "p2");
        console.timeEnd("detection p2");
        console.time("detection p3");
        detectionAretesOpposees(vertices, p3, p1, h3, "p3");
        console.timeEnd("detection p3");


        vertices.push(v1);
        vertices.push(v2);
        vertices.push(v3);
    }

    console.time("trierPoint");
    points = trierPoints(points);
    console.timeEnd("trierPoint");

    console.time("trierVertex");
    vertices = trierVertex(vertices);
    console.timeEnd("trierVertex");

    console.time("trierFaces");
    faces = trierFaces(faces);
    console.timeEnd("trierFaces");


    console.log("Data filled")
    onProgress(100);
    return new Mesh(vertices, faces, points);
}

function getOppositeEdge(face) {
    let edge = face.edge
    let nextEdge = edge.next

    while(nextEdge !== edge) {
        setOppositeEdge(nextEdge)
        nextEdge = nextEdge.next
    }
}

function setOppositeEdge(h) {
    const sommetDepart = h.headVertex();
    const sommetArrivee = h.tailVertex();
    const opp = sommetDepart.halfedgesTab.find(he => he.tailVertex() === sommetDepart && he.headVertex() === sommetArrivee)
    if(opp !== undefined) {

        if (opp.opposite !== null) console.error("HalfEdge already define" + opp)
        else {
            h.setOpposite(opp)
            opp.setOpposite(h)
        }


            // removeFromHalfedgesTab(sommetDepart.halfedgesTab, [h, opp])
            // removeFromHalfedgesTab(sommetArrivee.halfedgesTab, [h, opp])
        }
}

function vertexDegree(vertex) {
    let result = 0;
    let e = vertex.edge;
    let pEdge = e.next.opposite;
    while (pEdge !== e) {
        pEdge = pEdge.next.opposite;
        result++;
    }
    return result + 1;
}


function trierPoints(points) {
    points.sort((a, b) => (
        a.compare(b)
    ));
    return points;
}

function isPointInList(newPoint, pointList) {
    return pointList.some(existingPoint => existingPoint.equals(newPoint));
}

function getPointInList(list, point) {
    return list.filter(e => e.equals(point))[0];
}

function trierVertex(vertices) {
    vertices.sort((a, b) => (
        a.compare(b)
    ));
    return vertices;
}

function trierFaces(faces) {
    faces.sort((a, b) => (
        a.compare(b)
    ));
    return faces
}

function ajouterPointAListe(p, points) {
    if (!isPointInList(p, points)) {
        points.push(p);
    } else {
        p = getPointInList(points, p);
    }
}

function detectionAretesOpposees(vertices, p1, p2, h, nom) {
    let vertex = vertices.filter(e => e.point.equals(p1));
    if (vertex.length !== 0) {
        //console.log(vertex)
        let halfedgeOppose = vertex.map(e => e.edge.prev).filter(e => e.vertexDepart.point.equals(p2))[0];
        if (typeof halfedgeOppose !== 'undefined') {
            if (halfedgeOppose.opposite == null) {
                halfedgeOppose.setOpposite(h);
                h.setOpposite(halfedgeOppose);
            } else {
                throw new Error("Erreur de topologie p" + nom + "// " + halfedgeOppose);
            }
        }
    }
}


function onProgress(xhr) {
    var progressBar = document.getElementById('progress-bar');
    var loadingMessage = document.getElementById('loading-message');

    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        progressBar.style.width = percentComplete + '%';

        loadingMessage.innerHTML = 'Chargement en cours... ' + Math.round(percentComplete) + '%';
    }
}*/
