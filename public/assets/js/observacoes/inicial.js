import { tratarData } from "../controle/functions/tratarData.js";

const monthInput = document.querySelector("#mes-observacao-input");

let dataAtual = new Date();

monthInput.value = `${tratarData(dataAtual).ano}-${tratarData(dataAtual).mes}`