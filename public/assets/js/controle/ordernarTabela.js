import { atualizarTabelasEDadosFinanceiro } from "./atualizarTabelasEDadosFinanceiros.js"

const ordernarSelect = document.querySelector("#ordernar-select")

const btnAtualizarTabela = document.querySelector("#atualizar-tabela-btn")

let ordem;
let desc;
function atualizarOrdenacao(){
    if(ordernarSelect.value == "Escolha"){
        ordem = "data";
        desc = "";
    }else if(ordernarSelect.value == "Descrição"){
        ordem = "descricao";
        desc = "";
    } else if(ordernarSelect.value == "Descrição decrescente"){
        ordem = "descricao";
        desc = "desc";
    } else if(ordernarSelect.value == "Categoria"){
        ordem = "categoria";
        desc = "";
    } else if(ordernarSelect.value == "Categoria decrescente"){
        ordem = "categoria";
        desc = "desc";
    } else if(ordernarSelect.value == "Data"){
        ordem = "data";
        desc = "";
    } else if(ordernarSelect.value == "Data decrescente"){
        ordem = "data";
        desc = "desc";
    } else if(ordernarSelect.value == "Entrada"){
        ordem = "tipo";
        desc = "";
    } else if(ordernarSelect.value == "Saída"){
        ordem = "tipo";
        desc = "desc";
    } else if(ordernarSelect.value == "Valor"){
        ordem = "valor";
        desc = "";
    } else if(ordernarSelect.value == "Valor decrescente"){
        ordem = "valor";
        desc = "desc";
    }
}

btnAtualizarTabela.addEventListener("click", async () => {
    atualizarOrdenacao()
    await atualizarTabelasEDadosFinanceiro(ordem, desc);
})

document.querySelector("#mes-tabela-input").addEventListener("change", async () => {
    atualizarOrdenacao()
    await atualizarTabelasEDadosFinanceiro(ordem, desc)
})