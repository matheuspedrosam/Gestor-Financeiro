const modalContainer = document.querySelector("#modal-container")

export function abrirModal(){
    modalContainer.classList.remove("hide");
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "17px";
}