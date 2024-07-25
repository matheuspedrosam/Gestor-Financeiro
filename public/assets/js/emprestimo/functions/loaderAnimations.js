const table = document.querySelector(".table-container")
const loader = document.querySelector("#loader")
const faturalDoMes = document.querySelector("#saldo-total-saidas-do-mes-container")

export function loaderAnimationON(){
    table.classList.add("hide");
    faturalDoMes.classList.add("hide");
    loader.classList.remove("hide");
}

export function loaderAnimationOFF(){
    setTimeout(() => {
        table.classList.remove("hide");
        faturalDoMes.classList.remove("hide");
        loader.classList.add("hide");
    }, 500)
}