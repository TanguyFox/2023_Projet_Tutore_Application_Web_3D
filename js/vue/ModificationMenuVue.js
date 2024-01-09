/**
 * module gérant le menu de modification
 */

let listeButton = document.querySelectorAll("#headerMenu li");
let listeContent = document.querySelectorAll(".contentModifMenu");

function changerPannel(){
    console.log(this);

    let nom = this.id.replace(/_button/g, '');
    let contenu = document.querySelector(`#${nom}_content`);
    console.log(contenu)

    listeContent.forEach((e)=>
        e.style.display="none"
    )
    contenu.style.display = "flex";
}

listeButton.forEach((elem) =>
        elem.addEventListener('click', changerPannel)
);