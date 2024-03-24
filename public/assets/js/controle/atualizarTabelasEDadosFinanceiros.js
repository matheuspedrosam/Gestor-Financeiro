import { getFirestore, collection, getDoc, getDocs, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { loaderAnimationON, loaderAnimationOFF } from "./functions/loaderAnimations.js";
import { tratarData } from "./functions/tratarData.js";

const db = getFirestore(app);
const auth = await getAuth();

const tableBodyFinanceiro = document.querySelectorAll(".table-container tbody")[0];

export async function atualizarTabelasEDadosFinanceiro(ordem, desc){

    const mesTabelaInput = document.querySelector("#mes-tabela-input");
    let mes = mesTabelaInput.value.split("-")[1];
    let ano = mesTabelaInput.value.split("-")[0];

    tableBodyFinanceiro.innerHTML = "";
    // tableBodyRelatorio.innerHTML = "";

    loaderAnimationON();
    
    auth.onAuthStateChanged(async (userCredentials) => {

        let q;
        if(desc == ""){
            q = await query(collection(db, "EntradasESaidas"), where("userID", "==", userCredentials.uid), where("mes", "==", mes), where("ano", "==", Number(ano)), orderBy(ordem));
        } else {
            q = await query(collection(db, "EntradasESaidas"), where("userID", "==", userCredentials.uid), where("mes", "==", mes), where("ano", "==", Number(ano)), orderBy(ordem, desc));
        }

        let queryCategorias = await getDocs(query(collection(db, "Categorias"), where("userID", "==", userCredentials.uid)))
        
        let categorias = [];
        queryCategorias.forEach(async (categoria) => {
            categorias.push({'id': categoria.id, 'nome': categoria.data().nome, 'classe': categoria.data().classe})
        });
        
        const queryEntradasESaidas = await getDocs(q);

        atualizarTabelaFinanceiro(queryEntradasESaidas, categorias);
        atualizarDadosGerais(queryEntradasESaidas);
        atualizarSaidasPorCategorias(queryEntradasESaidas, categorias);
        atualizarSaidasPorClasseDeCategoria(queryEntradasESaidas, categorias);
    })

    loaderAnimationOFF();    

}
await atualizarTabelasEDadosFinanceiro("descricao", "");


// Functions:

async function atualizarTabelaFinanceiro(queryEntradasESaidas, categorias){
    queryEntradasESaidas.forEach(async (entradasESaidas) => {

        let data = new Date(entradasESaidas.data().data.seconds * 1000);
        let dataFormatada = `${tratarData(data).dia}/${tratarData(data).mes}/${tratarData(data).ano}`;
        
        let spanTipo;
        let classValor;
        let simbolo;
        if(entradasESaidas.data().tipo == "entrada"){
            spanTipo = `<span class="material-symbols-outlined tipo-entrada">expand_circle_up</span>`;
            classValor = "valor-entrada";
            simbolo = "+";
        } else{
            spanTipo = `<span class="material-symbols-outlined tipo-saida">expand_circle_down</span>`;
            classValor = "valor-saida";
            simbolo = "";
        }
        
        let valor;
        let regexp = /\./;
        if(regexp.test(String(entradasESaidas.data().valor))){
            valor = String(entradasESaidas.data().valor.toFixed(2)).replace(".", ",");
        } else{
            valor = `${entradasESaidas.data().valor},00`;
        }
        
        let categoriaNome;
        for (let categoria of categorias){
            if(categoria.id == entradasESaidas.data().categoria.id){
                categoriaNome = categoria.nome;
            }
        }
        
        tableBodyFinanceiro.innerHTML += `
            <tr id="${entradasESaidas.id}">
                <td>${entradasESaidas.data().descricao}</td>
                <td>${entradasESaidas.data().observacao}</td>
                <td>${categoriaNome}</td>
                <td>${dataFormatada}</td>
                <td>${spanTipo}</td>
                <td class="${classValor}">R$ ${simbolo}${valor}</td>
                <td>Excluir</td>
            </tr>
        `;
    })
}


function atualizarDadosGerais(queryEntradasESaidas){
    let total = 0
    let totalEntradas = 0
    let totalSaidas = 0
    queryEntradasESaidas.forEach(entradasESaidas => {
        if(entradasESaidas.data().tipo == "entrada"){
            totalEntradas += entradasESaidas.data().valor
        } else if(entradasESaidas.data().tipo == "saida"){
            totalSaidas += entradasESaidas.data().valor
        }
    })
    total = totalEntradas + totalSaidas
    

    const saldoTotalDoMesContainer = document.querySelector("#saldo-total-do-mes-container")
    const spanSaldoTotal = document.querySelector("#saldo-total");
    const iconSpanSaldoTotal = document.querySelector("#icon-saldo-total")

    if(total >= 0){
        saldoTotalDoMesContainer.style.border = "1px solid var(--cor-verde)"
        spanSaldoTotal.classList.remove("valor-saida")
        spanSaldoTotal.classList.add("valor-entrada")
        iconSpanSaldoTotal.innerText = "expand_circle_up"
        iconSpanSaldoTotal.classList.remove("tipo-saida")
        iconSpanSaldoTotal.classList.add("tipo-entrada")
    } else if(total < 0) {
        console.log(iconSpanSaldoTotal)
        saldoTotalDoMesContainer.style.border = "1px solid red"
        spanSaldoTotal.classList.remove("valor-entrada")
        spanSaldoTotal.classList.add("valor-saida")
        iconSpanSaldoTotal.innerText = "expand_circle_down"
        iconSpanSaldoTotal.classList.remove("tipo-entrada")
        iconSpanSaldoTotal.classList.add("tipo-saida")
    }
    spanSaldoTotal.innerText = `R$ ${String(total.toFixed(2)).replace(".", ",")}`


    const spanSaldoTotalEntradas = document.querySelector("#saldo-total-entradas");
    const spanSaldoTotalSaidas = document.querySelector("#saldo-total-saidas");

    spanSaldoTotalEntradas.innerText = `R$ ${String(totalEntradas.toFixed(2)).replace(".", ",")}`
    spanSaldoTotalSaidas.innerText = `R$ ${String(totalSaidas.toFixed(2)).replace(".", ",")}`
}


function atualizarSaidasPorCategorias(queryEntradasESaidas, categorias){
    for (let categoria of categorias){
        let somaTotalSaidasCategoria = 0;

        queryEntradasESaidas.forEach(entradasESaidas => {
            if(categoria.id == entradasESaidas.data().categoria.id){
                if(entradasESaidas.data().tipo == "saida"){
                    somaTotalSaidasCategoria += entradasESaidas.data().valor;
                }
            }
        })

        categoria["somaTotalSaidasCategoria"] = somaTotalSaidasCategoria
    }
    
    const tableBodyRelatorio = document.querySelectorAll(".table-container tbody")[1];
    tableBodyRelatorio.innerHTML = ""
    
    let className = "";
    for(let categoria of categorias){
        if(categoria.somaTotalSaidasCategoria >= 0) {
            className = "valor-entrada";
        } else{
            className = "valor-saida";
        }
        
        tableBodyRelatorio.innerHTML += `
            <tr>
                <td>${categoria.nome}</td>
                <td class="${className}">R$ ${String(categoria.somaTotalSaidasCategoria.toFixed(2)).replace(".", ",")}</td>
            </tr>
        `
    }
}


function atualizarSaidasPorClasseDeCategoria(queryEntradasESaidas, categorias){
    console.log(categorias)
    let naoEssencialTotal = 0;
    let essencialTotal = 0
    for (let categoria of categorias){

        queryEntradasESaidas.forEach((entradasESaidas) => {
            if(entradasESaidas.data().tipo == "saida"){
                if(entradasESaidas.data().categoria.id == categoria.id){
                    if(categoria["classe"] == "Não Essencial"){
                        naoEssencialTotal += 1;
                    } else if (categoria["classe"] == "Essencial"){
                        essencialTotal += 1;
                    }
                }
            }
        })
    }

    let essencialTotalContainer = document.querySelector("#essencial-total-container")
    let spanEssencialTotal = document.querySelector("#essencial-total-container span")

    let naoEssencialTotalContainer = document.querySelector("#nao-essencial-total-container")
    let spanNaoEssencialTotal = document.querySelector("#nao-essencial-total-container span")

    let totalEssencialOuNao = essencialTotal + naoEssencialTotal

    naoEssencialTotal = naoEssencialTotal / totalEssencialOuNao * 100
    essencialTotal = essencialTotal / totalEssencialOuNao * 100

    essencialTotalContainer.style.width = `${essencialTotal.toFixed(2)}%`
    spanEssencialTotal.innerText = `Essencial (${essencialTotal.toFixed(2)}%)`

    naoEssencialTotalContainer.style.width = `${naoEssencialTotal.toFixed(2)}%`
    spanNaoEssencialTotal.innerText = `Não Essencial (${naoEssencialTotal.toFixed(2)}%)`
}