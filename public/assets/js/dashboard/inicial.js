import { atualizarTabelasEDadosFinanceiro } from "./dashboard.js";
import { tratarData } from "./functions/tratarData.js";

// Modificar o Header e o Aside;
document.querySelector("main-header h1").innerHTML = "Relatórios";
document.querySelectorAll("main-aside .asideMenuButtons")[2].classList.add("asideCurrentButton");

const dataAtual = new Date();
const ano = tratarData(dataAtual).ano;
const mes = tratarData(dataAtual).mes;

const inputVisualizarTabelaDoMes = document.querySelector("#mes-tabela-input");
inputVisualizarTabelaDoMes.value = `${ano}-${mes}`;

await atualizarTabelasEDadosFinanceiro("data", "");

inputVisualizarTabelaDoMes.addEventListener("change", async () => {
    await atualizarTabelasEDadosFinanceiro("data", "");
});