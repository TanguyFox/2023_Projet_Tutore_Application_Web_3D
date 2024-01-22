const html = `
<div class="menuContextuel">
  <a href="#"><div id="suppMenuContextuel">Point</div></a>
  <a href="#"><div></div></a>
  <a href="#"><div></div></a>
  <a href="#"><div></div></a>
  <a href="#"><div></div></a>
</div>
`;

const menuContextuelDiv = document.querySelector("#menuContextuel");

export function appearMenuContextuel(event){
    //event.preventDefault();
    menuContextuelDiv.innerHTML = html;
    menuContextuelDiv.style.top = event.clientY + "px";
    menuContextuelDiv.style.left = event.clientX + "px";
    console.log("menuContextuel : " + event.clientX + " : " + event.clientY);
    menuContextuelDiv.children[0].style.opacity = "1";

}

menuContextuelDiv.addEventListener('mouseleave', function(){
    menuContextuelDiv.innerHTML='';
})

