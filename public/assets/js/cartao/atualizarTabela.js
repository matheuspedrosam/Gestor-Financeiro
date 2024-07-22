import { getFirestore, collection, getDoc, getDocs, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { loaderAnimationON, loaderAnimationOFF } from "./functions/loaderAnimations.js";
import { tratarData } from "./functions/tratarData.js";

const db = getFirestore(app);
const auth = await getAuth(app);

let mes;
let ano;

const tableBodyFinanceiro = document.querySelectorAll(".table-container tbody")[0];

export async function atualizarTabelasEDadosFinanceiro(ordem, desc){

    const mesTabelaInput = document.querySelector("#mes-tabela-input");
    mes = mesTabelaInput.value.split("-")[1];
    ano = mesTabelaInput.value.split("-")[0];

    tableBodyFinanceiro.innerHTML = "";
    // tableBodyRelatorio.innerHTML = "";

    loaderAnimationON();
    
    auth.onAuthStateChanged(async (userCredentials) => {
        let q;
        if(desc == ""){
            q = await query(collection(db, "Cartao"), where("userID", "==", userCredentials.uid), where("parcelas", "array-contains", `${ano}-${mes}`), orderBy(ordem))
        } else {
            q = await query(collection(db, "Cartao"), where("userID", "==", userCredentials.uid), where("parcelas", "array-contains", `${ano}-${mes}`), orderBy(ordem, desc));
        }

        let queryCategorias = await getDocs(query(collection(db, "Categorias"), where("userID", "==", userCredentials.uid), orderBy("nome")))
        
        let categorias = [];
        queryCategorias.forEach(async (categoria) => {
            categorias.push({'id': categoria.id, 'nome': categoria.data().nome, 'classe': categoria.data().classe, 'metaGasto': categoria.data().metaGasto})
        });
        
        const queryEntradasESaidas = await getDocs(q);

        atualizarTabelaFinanceiro(queryEntradasESaidas, categorias);
        atualizarDadosGerais(queryEntradasESaidas);
    })

    loaderAnimationOFF();    

}
await atualizarTabelasEDadosFinanceiro("data", "");



// Functions:

export async function atualizarTabelaFinanceiro(queryEntradasESaidas, categorias){
    queryEntradasESaidas.forEach(async (entradasESaidas) => {

        let data = new Date(entradasESaidas.data().data.seconds * 1000);
        let dataFormatada = `${tratarData(data).dia}/${tratarData(data).mes}/${tratarData(data).ano}`;
        
        let arrayParcelas = entradasESaidas.data().parcelas;
        let parcelaAtual;
        for(const parcela of arrayParcelas){
            if(parcela === `${ano}-${mes}`){
                parcelaAtual = arrayParcelas.indexOf(parcela) + 1;
            }
        }
        let totalParcelas = arrayParcelas.length;

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
        
        let categoriaNome;
        let categoriaClasse;
        for (let categoria of categorias){
            if(categoria.id == entradasESaidas.data().categoria.id){
                categoriaNome = categoria.nome;
                categoriaClasse = categoria.classe;
            }
        }

        if(!categoriaClasse){
            spanTipo = `<span class="material-symbols-outlined tipo-error">error</span>`
        } else if(categoriaClasse == "Investimento"){
            spanTipo = `<span class="material-symbols-outlined tipo-investimento">trending_up</span>`
        }

        if(!categoriaNome){ //Caso a categoria tenha sido Excluida:
            categoriaNome = `
                <span style='background: rgba(0, 0, 0, 0.15); padding: 5px; border-radius: 5px;'>
                    Você Excluiu Essa Categoria ❗
                </span>
            `
        }
        
        tableBodyFinanceiro.innerHTML += `
            <tr id="${entradasESaidas.id}">
                <td>${entradasESaidas.data().descricao} <strong>(${parcelaAtual}/${totalParcelas})</strong></td>
                <td>${entradasESaidas.data().observacao}</td>
                <td>${categoriaNome}</td>
                <td>${dataFormatada}</td>
                <td>${spanTipo}</td>
                <td class="${classValor}">${simbolo}${entradasESaidas.data().valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                <td class="${entradasESaidas.data().faturaDoMes}">Editar</td>
                <td>Excluir</td>
            </tr>
        `;
    })
}


// The Code when Financeiro and Relatorio were in the same page:
// After is just call the functions in the main function


// export function atualizarSaidasPorCategorias(queryEntradasESaidas, categorias){
//     for (let categoria of categorias){
//         let somaTotalSaidasCategoria = 0;
        
//         queryEntradasESaidas.forEach(entradasESaidas => {
//             if(categoria.id == entradasESaidas.data().categoria.id){
//                 if(entradasESaidas.data().tipo == "saida"){
//                     somaTotalSaidasCategoria += entradasESaidas.data().valor;
//                 }
//             }
//         })
        
//         categoria["somaTotalSaidasCategoria"] = somaTotalSaidasCategoria;
//     }
    
//     const tableBodyRelatorio = document.querySelectorAll(".table-container tbody")[1];
//     tableBodyRelatorio.innerHTML = "";
    
//     let className = "";
//     let meta;
//     let objetivo;
//     for(let categoria of categorias){
//         if(categoria.somaTotalSaidasCategoria >= 0) {
//             className = "valor-entrada";
//         } else{
//             className = "valor-saida";
//         }
        
//         if(categoria.metaGasto == undefined){
//             meta = "";
//             objetivo = "";
//         } else{
//             meta = `-${categoria.metaGasto.toLocaleString("pt-BR", {style: 'currency', currency: "BRL"})}`;
            
//             if(categoria.somaTotalSaidasCategoria >= Number(`-${categoria.metaGasto}`)){
//                 objetivo = "✅";
//             } else{
//                 objetivo = "❌";
//             }
//         }
        
//         if(categoria.classe != "Investimento"){
//             tableBodyRelatorio.innerHTML += `
//             <tr>
//             <td>${categoria.nome}</td>
//             <td>${categoria.classe}</td>
//             <td class="${className}">${categoria.somaTotalSaidasCategoria.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
//             <td>${meta}</td>
//             <td>${objetivo}</td>
//             </tr>
//             `
//         }
//     }
// }



// function atualizarInvestimentos(queryEntradasESaidas, categorias){
//     const tableBodyInvestimentos = document.querySelectorAll(".table-container tbody")[2];
//     tableBodyInvestimentos.innerHTML = "";

//     let meta;
//     let objetivo;
//     let className;
//     for (let categoria of categorias){
//         if(categoria.classe == "Investimento"){
//             if(categoria.somaTotalSaidasCategoria < 0) {
//                 className = "valor-entrada";
//             } else{
//                 className = "valor-saida";
//             }
            
//             if(categoria.metaGasto == undefined){
//                 meta = "";
//                 objetivo = "";
//             } else{
//                 meta = `${categoria.metaGasto.toLocaleString("pt-BR", {style: 'currency', currency: "BRL"})}`;

//                 if(categoria.somaTotalSaidasCategoria > Number(`-${categoria.metaGasto}`)){
//                     objetivo = "❌";
//                 } else{
//                     objetivo = "✅";
//                 }
//             }

//             tableBodyInvestimentos.innerHTML += `
//                 <tr>
//                     <td>${categoria.nome}</td>
//                     <td class="${className}">${categoria.somaTotalSaidasCategoria.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}).replace("-", "+")}</td>
//                     <td>${meta}</td>
//                     <td>${objetivo}</td>
//                 </tr>
//             `
//         }

//     }
    
            
// }


            
export function atualizarDadosGerais(queryEntradasESaidas){
    let totalEntradas = 0
    let totalSaidas = 0
    queryEntradasESaidas.forEach(entradasESaidas => {
        if(entradasESaidas.data().tipo == "entrada"){
            totalEntradas += entradasESaidas.data().valor
        } else if(entradasESaidas.data().tipo == "saida"){
            totalSaidas += entradasESaidas.data().valor
        }
    })

    const spanSaldoTotalSaidas = document.querySelector("#saldo-total-saidas");

    spanSaldoTotalSaidas.innerText = `${totalSaidas.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
}

   

// export function atualizarSaidasPorClasseDeCategoria(queryEntradasESaidas, categorias){
//     let naoEssencialTotal = 0;
//     let essencialTotal = 0
//     let investimentoTotal = 0;
//     for (let categoria of categorias){

//         queryEntradasESaidas.forEach((entradasESaidas) => {
//             if(entradasESaidas.data().tipo == "saida"){
//                 if(entradasESaidas.data().categoria.id == categoria.id){
//                     if(categoria["classe"] == "Essencial"){
//                         essencialTotal += entradasESaidas.data().valor;
//                     } else if ( categoria["classe"] == "Não Essencial"){
//                         naoEssencialTotal += entradasESaidas.data().valor;
//                     } else if (categoria["classe"] == "Investimento"){
//                         investimentoTotal += entradasESaidas.data().valor;
//                     }
//                 }
//             }
//         })
//     }

//     let essencialTotalContainer = document.querySelector("#essencial-total-container")
//     let spanEssencialTotal = document.querySelector("span#essencial-total")
    
//     let naoEssencialTotalContainer = document.querySelector("#nao-essencial-total-container")
//     let spanNaoEssencialTotal = document.querySelector("span#nao-essencial-total")
    
//     let investimentoTotalContainer = document.querySelector("#investimento-total-container")
//     let spanInvestimentoTotal = document.querySelector("span#investimento-total")

//     let totalEssencialOuNaoOuInvestimento = essencialTotal + naoEssencialTotal + investimentoTotal;

//     essencialTotal = (essencialTotal / totalEssencialOuNaoOuInvestimento) * 100
//     naoEssencialTotal = (naoEssencialTotal / totalEssencialOuNaoOuInvestimento) * 100
//     investimentoTotal = (investimentoTotal / totalEssencialOuNaoOuInvestimento) * 100

//     if(totalEssencialOuNaoOuInvestimento != 0){
//         //Essencial
//         essencialTotalContainer.style.width = `${essencialTotal.toFixed(2)}%`
//         spanEssencialTotal.innerText = `Essencial (${essencialTotal.toFixed(2)}%)`

//         //Não Essencial
//         naoEssencialTotalContainer.style.width = `${naoEssencialTotal.toFixed(2)}%`
//         spanNaoEssencialTotal.innerText = `Não Essencial (${naoEssencialTotal.toFixed(2)}%)`

//         //Investimento
//         investimentoTotalContainer.style.width = `${investimentoTotal.toFixed(2) + 1}%`
//         spanInvestimentoTotal.innerText = `Investimentos (${investimentoTotal.toFixed(2)}%)`
//     } else{
//         //Essencial
//         essencialTotalContainer.style.width = `20%`
//         spanEssencialTotal.innerText = `Essencial (0%)`

//         //Não Essencial
//         naoEssencialTotalContainer.style.width = `20%`
//         spanNaoEssencialTotal.innerText = `Não Essencial (0%)`

//         //Investimento
//         investimentoTotalContainer.style.width = `20%`
//         spanInvestimentoTotal.innerText = `Investimentos (0%)`
//     }

// }