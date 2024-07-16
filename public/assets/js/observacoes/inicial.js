import { tratarData } from "../controle/functions/tratarData.js";

// Modificar o Header e o Aside;
document.querySelector("main-header h1").innerHTML = "Observações";
document.querySelectorAll("main-aside .asideMenuButtons")[3].classList.add("asideCurrentButton");

const monthInput = document.querySelector("#mes-observacao-input");

let dataAtual = new Date();

monthInput.value = `${tratarData(dataAtual).ano}-${tratarData(dataAtual).mes}`