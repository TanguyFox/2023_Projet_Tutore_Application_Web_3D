/**
 * module gérant le menu de modification
 */

let listeButton = document.querySelectorAll("#headerMenu li");
let listeContent = document.querySelectorAll(".contentModifMenu");
let clicked;
let valeurTranslateIndicatorPrecedente;
const indicator = document.querySelector('#indicator');

function changerPannel(){
    let nom = this.id.replace(/_button/g, '');
    let contenu = document.querySelector(`#${nom}_content`);
    listeContent.forEach((e)=>
        e.style.display="none"
    )
    contenu.style.display = "flex";
    clicked = true;
}

listeButton.forEach((elem) =>
        elem.addEventListener('click', changerPannel)
);

function survolerIndicator(){
    let index = Array.from(listeButton).indexOf(this);
    let nouvelleValeur = 155*index;
    valeurTranslateIndicatorPrecedente = indicator.style.transform;
    indicator.style.transform = 'translateX(calc( ' + nouvelleValeur + 'px))';
    clicked = false;
}

listeButton.forEach((element)=>
    element.addEventListener('mouseover', survolerIndicator)
);

function retablirIndicator(){
    if(!clicked){
        indicator.style.transform = valeurTranslateIndicatorPrecedente;
    }
}

listeButton.forEach((ele) =>
    ele.addEventListener('mouseout', retablirIndicator)
)