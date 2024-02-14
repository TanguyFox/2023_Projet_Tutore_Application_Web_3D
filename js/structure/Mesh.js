import {createCylinder, createTriangle, group,} from "../tool/Element3DGeneraux.js";

export class Mesh {
    constructor(faces, bhe) {
        this.faces = faces;
        this.boundaryEdges = bhe;
    }
}

Mesh.prototype.detectHoles = function () {
    let holes = [];
    for (let face in this.faces) {
        if (face.getAdjHole() !== 3) {
            holes.push(face);
        }
    }
    return holes;
}

Mesh.prototype.highlightEdge = function () {

    if (this.boundaryEdges.length === 0) {
        document.getElementById("repair_button").disabled = true;
        return;
    }

    document.getElementById("repair_button").disabled = false;

    let nbHoles = 0;
    let problemHE = 0;

    this.boundaryEdges.forEach(edge => {
        let cylinder = createCylinder(edge);
        group.add(cylinder);
        problemHE++;
    })

    if (this.boundaryEdges.length === 3) {
        group.add(createTriangle(this.boundaryEdges[0].vertex, this.boundaryEdges[1].vertex, this.boundaryEdges[2].vertex));
       document.getElementById("nb_trous").textContent = "1";
    } else {
        let holes = this.identifyHoles();
        console.log(holes);

        let triangles = this.triangulateHoles(holes);
        if (triangles !== undefined) {
            triangles.forEach(t => {
                let triangle = createTriangle(t[0], t[1], t[2])
                group.add(triangle);
            })
        }
    }
    document.getElementById("nb_hp").innerHTML = problemHE;
    this.infoFichierMenuModif();
    // console.log(group)
}

Mesh.prototype.identifyHoles = function () {
    const holes = [];
    const visited = new Set();

    let startEdge = this.boundaryEdges[0];
    let nextVertex = startEdge.tailVertex();
    visited.add(startEdge);

    let hole = [startEdge.headVertex(), nextVertex];
    while(nextVertex !== startEdge.headVertex()) {
        let bound = this.getFacesFromVertex(nextVertex).find(face => face.getAdjHole() < 3).getBoundaryEdges();
    }

    return holes;
};

Mesh.prototype.triangulateHoles = function (holes) {
    if (holes.length === 0) {
        return;
    }
    let triangles = [];
    holes.forEach(hole => {
        for (let i = 1; i < hole.length - 1; i++) {
            let triangle = [hole[0], hole[i], hole[i + 1]];
            triangles.push(triangle);
        }
    })
    document.getElementById("nb_trous").textContent = holes.length;
    return triangles
}

Mesh.prototype.infoFichierMenuModif = function () {
    let parentNodeProblem = document.querySelector("#problem_content");
    console.log(this.boundaryEdges);

    if (this.boundaryEdges.length > 0) {
        let divConteneur = document.createElement("div");
        divConteneur.id = "infoFichierProbems";
        parentNodeProblem.appendChild(divConteneur)
        let titreSection = document.createElement("p");
        titreSection.textContent = "Informations dans le fichier :";
        titreSection.style.fontWeight = 'bold';
        divConteneur.appendChild(titreSection);


        this.boundaryEdges.sort(
            (a, b) => a.face.indice - b.face.indice
        );
        //n = 10 pour nb 0<x<500
        //n = 20 pour nb 500<x<1000
        //n = 30 pour nb 1000<x<1500
        //etc...
        //taille cible de chaque section = 50 pour x>500
        //taille cible de chaque section = 10 pour
        console.log("taille = " + this.boundaryEdges.length);
        let n = calculerNbSection(this.boundaryEdges.length);
        console.log("n = " + n);

        let sections = diviserTableau(this.boundaryEdges, n);
        console.log(sections)
        let i = 0;
        sections.forEach(section => {
            let liste = document.createElement("div");
            liste.classList.add("dropdown")
            divConteneur.appendChild(liste);
            //BUTTON
            let button = document.createElement("button");
            button.classList.add("dropbtn");
            // button.textContent = i;
            button.innerHTML = `
                <img src="../../resources/img/iconsMenu/fleche-droite.png"> ${i}
            `;
            liste.appendChild(button)
            //dropdown-content
            let dropdown_content = document.createElement("ul");
            dropdown_content.classList.add("dropdown-content");
            liste.appendChild(dropdown_content);
            section.forEach(e => {
                let ligne = document.createElement("li");
                dropdown_content.appendChild(ligne);
                let writtenLikeSTL = writeLikeSTL(e);
                ligne.innerHTML = `
        <p>Face n° ${e.face.indice}, ligne ${(e.face.indice / 9) * 7 + 4}</p>
        <textarea style="height: 50px">${writtenLikeSTL}</textarea>
        `;
            })
            i++;
        })

        /* this.boundaryEdges.forEach(e => {

         })

         */
    }
}

function writeLikeSTL(halfedge) {
    let p1 = halfedge.vertex.point;
    let p2 = halfedge.next.vertex.point;
    let result = "";
    if (typeof p1 !== undefined) {
        result += "vertex " + p1.toString() + "\n" +
            "\t\t\t";
    }
    if (typeof p2 !== undefined) {
        result += "vertex " + p2.toString();
    }
    return result;
}

function calculerNbSection(tailleTotale) {
    return arrondirDixaineSuperieur((tailleTotale * 10) / 500);

}


function arrondirDixaineSuperieur(nombre) {
    return Math.ceil(nombre / 10) * 10;
}

function diviserTableau(tableau, tailleSection) {
    const nombreSections = Math.ceil(tableau.length / tailleSection);
    const sections = [];
    let debut = 0;
    for (let i = 0; i < nombreSections; i++) {
        const fin = Math.min(debut + tailleSection, tableau.length);
        sections.push(tableau.slice(debut, fin));
        debut = fin;
    }
    return sections;
}


Mesh.prototype.getFacesFromVertex = function (vertex) {
    return this.faces.filter(face => face.getSommets().includes(vertex));
}