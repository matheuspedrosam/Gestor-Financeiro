import { getFirestore, collection, getDocs, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { loaderAnimationON, loaderAnimationOFF } from "./functions/loaderAnimations.js";

const db = getFirestore(app);
const auth = await getAuth(app);

const tableBodyFinanceiro = document.querySelectorAll(".table-container tbody")[0];

export async function atualizarTabelasEDadosFinanceiro(ordem, desc){

    tableBodyFinanceiro.innerHTML = "";
    // tableBodyRelatorio.innerHTML = "";

    loaderAnimationON();
    
    auth.onAuthStateChanged(async (userCredentials) => {

        let q;
        if(desc == ""){
            q = await query(collection(db, "Recorrentes"), where("userID", "==", userCredentials.uid), orderBy(ordem));
        } else {
            q = await query(collection(db, "Recorrentes"), where("userID", "==", userCredentials.uid), orderBy(ordem, desc));
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
await atualizarTabelasEDadosFinanceiro("descricao", "");



// Functions:

export async function atualizarTabelaFinanceiro(queryEntradasESaidas, categorias){
    queryEntradasESaidas.forEach(async (entradasESaidas) => {
        
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
                <td>${entradasESaidas.data().descricao}</td>
                <td>${entradasESaidas.data().observacao}</td>
                <td>${categoriaNome}</td>
                <td>${spanTipo}</td>
                <td class="${classValor}">${simbolo}${entradasESaidas.data().valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                <td>Editar</td>
                <td>Excluir</td>
            </tr>
        `;
    })
}

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

    const spanSaldoTotalEntradas = document.querySelector("#saldo-total-entradas");
    const spanSaldoTotalSaidas = document.querySelector("#saldo-total-saidas");

    spanSaldoTotalEntradas.innerText = `${totalEntradas.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
    spanSaldoTotalSaidas.innerText = `${totalSaidas.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
}