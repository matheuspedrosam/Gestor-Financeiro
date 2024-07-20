import { atualizarTabelasEDadosFinanceiro } from "./atualizarTabela.js"

const ordernarSelect = document.querySelector("#ordernar-select");

ordernarSelect.addEventListener("change", async () => {

    let ordem;
    let desc;

    if(ordernarSelect.value == "Escolha"){
        ordem = "descricao";
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
    

    await atualizarTabelasEDadosFinanceiro(ordem, desc);
})