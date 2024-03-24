const table = document.querySelector(".table-container")
const loader = document.querySelector("#loader")

export function loaderAnimationON(){
    table.classList.add("hide");
    loader.classList.remove("hide");
}

export function loaderAnimationOFF(){
    setTimeout(() => {
        table.classList.remove("hide");
        loader.classList.add("hide");
    }, 500)
}