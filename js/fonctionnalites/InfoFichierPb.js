import fleche from "../../public/resources/img/iconsMenu/fleche-droite.png";

/**
 * Module gérant l'affichage des informations sur les fichiers STL dans le menu de modification de l'interface
 */


/**
 * Affiche les informations sur le fichier STL dans le menu de modification de l'interface
 * @param mesh - Le maillage de l'objet 3D
 */
export function infoFichierMenuModif (mesh) {
    let parentNodeProblem = document.querySelector("#problem_content"); // référence au pannel des problèmes


    if (mesh.boundaryEdges.length > 0) {

        // Création de la section d'affichage des informations sur le fichier
        let divConteneur = document.createElement("div");
        divConteneur.id = "infoFichierProbems";
        parentNodeProblem.appendChild(divConteneur)
        let titreSection = document.createElement("p");
        titreSection.textContent = "Informations dans le fichier :";
        titreSection.style.fontWeight = 'bold';
        divConteneur.appendChild(titreSection);


        mesh.boundaryEdges.sort(
            (a, b) => a.face.indice - b.face.indice
        );
        //n = 10 pour nb 0<x<500
        //n = 20 pour nb 500<x<1000
        //n = 30 pour nb 1000<x<1500
        //etc...
        //taille cible de chaque section = 50 pour x>500
        //taille cible de chaque section = 10 pour

        let n = calculerNbSection(mesh.boundaryEdges.length);

        let sections = diviserTableau(mesh.boundaryEdges, n);

        let i = 0;

        // Pour chaque section, on crée un bouton qui, lorsqu'il est cliqué, affiche les informations sur les faces de la section
        sections.forEach(section => {

            let liste = document.createElement("div");
            liste.classList.add("dropdown")
            divConteneur.appendChild(liste);
            //BUTTON
            let button = document.createElement("button");
            button.classList.add("dropbtn");
            // button.textContent = i;
            button.innerHTML = `
                <img src=${fleche} alt="fleche" /> ${i}
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
        <textarea readonly style="height: 50px">${writtenLikeSTL}</textarea>
        `;
            });
            eventButtonShow(button);
            i++;
        })
    }
}


/**
 * Retourne une chaîne de caractères représentant un demi-arête sous la forme d'un triangle STL
 * @param halfedge - La demi-arête à écrire
 * @returns {string}
 */
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

/**
 * Calcule le nombre de sections à afficher en fonction de la taille du tableau de boundaryEdges
 * @param tailleTotale - La taille du tableau de boundaryEdges
 * @returns {number}
 */
function calculerNbSection(tailleTotale) {
    return arrondirDixaineSuperieur((tailleTotale * 10) / 500);

}


function arrondirDixaineSuperieur(nombre) {
    return Math.ceil(nombre / 10) * 10;
}

/**
 * Divise un tableau en sections de taille égale
 * @param tableau - Le tableau à diviser
 * @param tailleSection - La taille de chaque section
 * @returns {[]}
 */
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


//Gestion transition
let selectedButton;

/**
 * Méthode permettant d'afficher ou de cacher les informations sur les faces d'un fichier STL
 * @param button - Le bouton sur lequel l'utilisateur a cliqué
 */
function eventButtonShow(button){
    let dropdown = button.parentNode;
    button.addEventListener('click', function(){

        if(typeof selectedButton !== 'undefined'){
            console.log("not undefinex, hidden")
            hiddenTab(selectedButton.parentNode, selectedButton);
        }
        if(button !== selectedButton){
            showTab(dropdown, button)
            selectedButton = button;
        } else {
            selectedButton = undefined;
        }


    })
}

/**
 * Affiche le contenu du dropdown et tourne la flèche
 * @param dropdown
 * @param button
 */
function showTab(dropdown, button){
    let dropdown_content = dropdown.children[1];
    dropdown.style.height = (dropdown_content.offsetHeight + button.offsetHeight) + "px";
    dropdown_content.style.visibility = "visible";
    dropdown_content.style.opacity = 1;
    dropdown_content.style.transitionDelay = "0.50s";
    button.children[0].style.transform= "rotate(90deg)";
}

/**
 * Cache le contenu du dropdown et remet la flèche à sa position initiale
 * @param dropdown
 * @param button
 */
function hiddenTab(dropdown, button){
    let dropdown_content = dropdown.children[1];
    dropdown.style.height = button.offsetHeight + "px";
    dropdown_content.style.transitionDelay = "0s";
    dropdown_content.style.transition = "0.1s all ease";
    dropdown_content.style.visibility = "hidden";
    dropdown_content.style.opacity = 0;
    button.children[0].style.transform= "rotate(0deg)";
}
