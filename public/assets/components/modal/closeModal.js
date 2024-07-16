const modalContainer = document.querySelector("#modal-container");
const closeBtn = document.querySelector("#close-btn span");

export function closeModal(){
    modalContainer.classList.add("hide");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
}

closeBtn.addEventListener("click", () => {
    closeModal();
})