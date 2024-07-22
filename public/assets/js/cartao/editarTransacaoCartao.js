import { getFirestore, doc, updateDoc, collection} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { abrirModal } from "../../components/modal/abrirModal.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelasEDadosFinanceiro } from "./atualizarTabela.js";
import { closeModal } from "../../components/modal/closeModal.js";
import { adiantarParcela } from "./adicionarTransacaoCartao.js";

const tableBodyRelatorio = document.querySelectorAll(".table-container tbody")[0];

const editarInputDescricao = document.querySelector("#editar-input-descricao");
const editarInputObservacao = document.querySelector("#editar-input-observacao");
const editarInputValor = document.querySelector("#editar-input-valor");
const editarSelectCategoria = document.querySelector("#editar-select-categoria");
const editarSelectTipo = document.querySelector("#editar-select-tipo");
const editarSelectParcelas = document.querySelector("#editar-select-parcelas");
const editarInputData = document.querySelector("#editar-input-data");

let editarArrayParcelasParaEnviarBanco = [];

var $transacaoParaserEditada;

let faturaDoMes;
tableBodyRelatorio.addEventListener("click", (event) => {
    if (event.target.innerHTML == "Editar"){
        faturaDoMes = event.target.classList.value;
        console.log(typeof faturaDoMes);
        $transacaoParaserEditada = event.target.parentNode.id
        abrirModal();
        editarInputDescricao.value = event.target.parentNode.children[0].innerHTML.split(" <strong>")[0]
        editarInputObservacao.value = event.target.parentNode.children[1].innerHTML
        editarInputValor.value = Number(event.target.parentNode.children[5].innerHTML.replace("R$&nbsp;", "").replace(".", "").replace(",", "").slice(0, -2));
        
        
        editarSelectCategoria.value = event.target.parentNode.children[2].innerHTML
        let optionID = editarSelectCategoria.options[editarSelectCategoria.selectedIndex].id
        editarSelectCategoria.classList = ""
        editarSelectCategoria.classList.add(optionID)

        event.target.parentNode.children[4].children[0].classList.contains("tipo-entrada") ? editarSelectTipo.value = "entrada" : editarSelectTipo.value = "saida";

        editarSelectParcelas.value = event.target.parentNode.children[0].innerHTML.split(" <strong>")[1].split('/')[1].split(')')[0]
        
        editarInputData.value = event.target.parentNode.children[3].innerHTML;
    }
})

const db = getFirestore(app);

// Editar Btn
const editarBtn = document.querySelector("#btn-editar-entrada-ou-saida");
editarBtn.addEventListener("click", async () => {
    if(validarDados()){
        // Tratamento das parcelas
        editarArrayParcelasParaEnviarBanco = [];
        let mes = editarInputData.value.split('/')[1]
        let ano = editarInputData.value.split('/')[2]

        let inicioParcela;
        faturaDoMes == 'false' ? inicioParcela = adiantarParcela(`${ano}-${mes}`) : inicioParcela = `${ano}-${mes}`;

        for(let i = 0; i < Number(editarSelectParcelas.value); i++){
            if(i == 0){
                editarArrayParcelasParaEnviarBanco.push(inicioParcela);
            } else{
                inicioParcela = adiantarParcela(inicioParcela);
                editarArrayParcelasParaEnviarBanco.push(inicioParcela);
            }
        }
        console.log(editarArrayParcelasParaEnviarBanco);


        await updateDoc(doc(db, "Cartao", $transacaoParaserEditada), {
            descricao: editarInputDescricao.value,
            observacao: editarInputObservacao.value,
            valor: editarInputValor.value.includes('-') ? Number(editarInputValor.value) : Number(`-${editarInputValor.value}`),
            categoria: await doc(db, 'Categorias', editarSelectCategoria.classList.value),
            parcelas: editarArrayParcelasParaEnviarBanco
            // tipo: editarSelectTipo.value
        });
        
        await atualizarTabelasEDadosFinanceiro("data", "");
        closeModal();
        alert("dados Atualizados com sucesso!");
    } else{
        alert("Dados Inválidos")
    }
})


function validarDados(){
    if(editarInputDescricao.value == "" || editarInputValor.value == "") return false;
    
    if(editarInputDescricao.value.length > 30) return false;
    
    if(editarInputObservacao.value.length > 50) return false;
    
    if(editarSelectCategoria.value == "escolha") return false;

    let regexp = /\./ 
    if(regexp.test(editarInputValor.value)){
        if(editarInputValor.value.split(".")[1].length > 2) return false;
    }
    
    // if(editarSelectTipo.value == "entrada" && editarInputValor.value < 0) return false;

    // if(editarSelectTipo.value == "saida" && editarInputValor.value > 0) return false;
    
    return true;
}