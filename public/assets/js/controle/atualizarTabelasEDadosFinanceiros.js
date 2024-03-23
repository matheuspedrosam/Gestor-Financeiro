import { getFirestore, collection, getDoc, getDocs, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { loaderAnimationON, loaderAnimationOFF } from "./functions/loaderAnimations.js"
import { tratarData } from "./functions/tratarData.js"

const db = getFirestore(app);
const auth = await getAuth();

const tableBodyFinanceiro = document.querySelectorAll(".table-container tbody")[0]
const tableBodyRelatorio = document.querySelectorAll(".table-container tbody")[1]

export function atualizarTabelasEDadosFinanceiro(ordem, desc){

    const ordernarSelect = document.querySelector("#ordernar-select")

    const mesTabelaInput = document.querySelector("#mes-tabela-input")
    let mes = mesTabelaInput.value.split("-")[1]
    let ano = mesTabelaInput.value.split("-")[0]

    tableBodyFinanceiro.innerHTML = ""
    // tableBodyRelatorio.innerHTML = ""

    loaderAnimationON();
    
    auth.onAuthStateChanged(async (userCredentials) => {

        let q;
        if(desc == ""){
            q = await query(collection(db, "EntradasESaidas"), where("userID", "==", userCredentials.uid), where("mes", "==", mes), where("ano", "==", Number(ano)), orderBy(ordem))
        } else {
            q = await query(collection(db, "EntradasESaidas"), where("userID", "==", userCredentials.uid), where("mes", "==", mes), where("ano", "==", Number(ano)), orderBy(ordem, desc))
        }

        const querySnapshot = await getDocs(q);
    
        querySnapshot.forEach(async (entradasESaidas) => {

            let categoria = await getDoc(entradasESaidas.data().categoria)

            let data = new Date(entradasESaidas.data().data.seconds * 1000)
            let dataFormatada = `${tratarData(data).dia}/${tratarData(data).mes}/${tratarData(data).ano}`;

            let spanTipo;
            let classValor;
            let simbolo;
            if(entradasESaidas.data().tipo == "entrada"){
                spanTipo = `<span class="material-symbols-outlined tipo-entrada">expand_circle_up</span>`
                classValor = "valor-entrada"
                simbolo = "+"
            } else{
                spanTipo = `<span class="material-symbols-outlined tipo-saida">expand_circle_down</span>`
                classValor = "valor-saida"
                simbolo = ""
            }

            let valor;
            if(/\./.test(entradasESaidas.data().valor)){
                valor = entradasESaidas.data().valor.replace(".", ",")
            } else{
                valor = `${entradasESaidas.data().valor},00`
            }

            tableBodyFinanceiro.innerHTML += `
                <tr id="${entradasESaidas.id}">
                    <td>${entradasESaidas.data().descricao}</td>
                    <td>${entradasESaidas.data().observacao}</td>
                    <td>${categoria.data().nome}</td>
                    <td>${dataFormatada}</td>
                    <td>${spanTipo}</td>
                    <td class="${classValor}">R$ ${simbolo}${valor}</td>
                    <td>Excluir</td>
                </tr>
            `

        })
    
    })

    loaderAnimationOFF();    

}

atualizarTabelasEDadosFinanceiro("descricao", "");