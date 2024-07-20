import { getFirestore, doc, updateDoc} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { abrirModal } from "../../components/modal/abrirModal.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelasEDadosFinanceiro } from "./atualizarTabela.js";
import { closeModal } from "../../components/modal/closeModal.js";

const tableBodyRelatorio = document.querySelectorAll(".table-container tbody")[0];

const editarInputDescricao = document.querySelector("#editar-input-descricao");
const editarInputObservacao = document.querySelector("#editar-input-observacao");
const editarInputValor = document.querySelector("#editar-input-valor");
const editarSelectCategoria = document.querySelector("#editar-select-categoria");
const editarSelectTipo = document.querySelector("#editar-select-tipo");

var $transacaoParaserEditada;

tableBodyRelatorio.addEventListener("click", (event) => {
    if (event.target.innerHTML == "Editar"){
        $transacaoParaserEditada = event.target.parentNode.id
        abrirModal();
        editarInputDescricao.value = event.target.parentNode.children[0].innerHTML
        editarInputObservacao.value = event.target.parentNode.children[1].innerHTML
        editarInputValor.value = Number(event.target.parentNode.children[4].innerHTML.replace("R$&nbsp;", "").replace(".", "").replace(",", "").slice(0, -2));
        
        
        editarSelectCategoria.value = event.target.parentNode.children[2].innerHTML
        let optionID = editarSelectCategoria.options[editarSelectCategoria.selectedIndex].id
        editarSelectCategoria.classList = ""
        editarSelectCategoria.classList.add(optionID)

        event.target.parentNode.children[3].children[0].classList.contains("tipo-entrada") ? editarSelectTipo.value = "entrada" : editarSelectTipo.value = "saida";
    }
})

const db = getFirestore(app);

// Editar Btn
const editarBtn = document.querySelector("#btn-editar-entrada-ou-saida");
editarBtn.addEventListener("click", async () => {
    if(validarDados()){
        console.log(editarSelectCategoria.value);
        console.log(editarSelectCategoria.classList.value);
        await updateDoc(doc(db, "Recorrentes", $transacaoParaserEditada), {
            descricao: editarInputDescricao.value,
            observacao: editarInputObservacao.value,
            valor: Number(editarInputValor.value),
            categoria: await doc(db, 'Categorias', editarSelectCategoria.classList.value),
            tipo: editarSelectTipo.value
        });
        
        await atualizarTabelasEDadosFinanceiro("descricao", "");
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
    
    if(editarSelectTipo.value == "entrada" && editarInputValor.value < 0) return false;

    if(editarSelectTipo.value == "saida" && editarInputValor.value > 0) return false;
    
    return true;
}