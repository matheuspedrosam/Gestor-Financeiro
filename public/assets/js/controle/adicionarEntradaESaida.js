import { getFirestore, collection, addDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelasEDadosFinanceiro } from "./atualizarTabelasEDadosFinanceiros.js";
import { tratarData } from "./functions/tratarData.js";

const descricaoInput = document.querySelector("#input-descricao");
const observacaoInput = document.querySelector("#input-observacao");
const valorInput = document.querySelector("#input-valor");
const categoriaSelect = document.querySelector("#select-categoria");
const tipoSelect = document.querySelector("#select-tipo");
const dataInput = document.querySelector("#input-data");

function validarDados(){
    if(descricaoInput.value == "" || valorInput.value == "") return false;
    
    if(descricaoInput.value.length > 30) return false;
    
    if(observacaoInput.value.length > 50) return false;
    
    if(categoriaSelect.value == "escolha") return false;

    let regexp = /\./ 
    if(regexp.test(valorInput.value)){
        if(valorInput.value.split(".")[1].length > 2) return false;
    }
    
    if(tipoSelect.value == "entrada" && valorInput.value < 0) return false;

    if(tipoSelect.value == "saida" && valorInput.value > 0) return false;

    // if(new Date(dataInput.value) > new Date()) return false; // Permitindo enviar coisas em datas futuras agora!
    
    return true;
}

function formatarString(string){
    // Para ficar primeira letra maiuscula e sem espaço no começo e depois
    if(string != ""){
        let stringFormatada = string.trimStart().trimEnd()
        return `${stringFormatada.charAt(0).toUpperCase()}${stringFormatada.substring(1)}`
    } else {
        return string;
    }
}

const btnAdicionarEntradaESaida = document.querySelector("#btn-adicionar-entrada-ou-saida");

btnAdicionarEntradaESaida.addEventListener("click", async (event) => {
    event.preventDefault();
    const $descricaoInputParaEnviarBanco = formatarString(descricaoInput.value)
    const $observacaoInputParaEnviarBanco = formatarString(observacaoInput.value)
    const $valorInputParaEnviarBanco = Number(valorInput.value)
    const $categoriaSelectParaEnviarBanco = categoriaSelect.classList.value
    const $tipoSelectParaEnviarBanco = tipoSelect.value
    const $dataInputParaEnviarBanco = dataInput.value
    
    if(validarDados()){
        
        const db = getFirestore(app);
        const auth = await getAuth(app);

        auth.onAuthStateChanged(async (userCredentials) => {
            await addDoc(collection(db, "EntradasESaidas"), {
                userID: userCredentials.uid,
                descricao: $descricaoInputParaEnviarBanco,
                observacao: $observacaoInputParaEnviarBanco,
                valor: $valorInputParaEnviarBanco,
                categoria: doc(db, "Categorias", $categoriaSelectParaEnviarBanco),
                tipo: $tipoSelectParaEnviarBanco,
                data: new Date(`${$dataInputParaEnviarBanco} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`),
                mes: tratarData(new Date(`${$dataInputParaEnviarBanco} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)).mes,
                ano: tratarData(new Date(`${$dataInputParaEnviarBanco} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)).ano 
            });
        })

        alert("Dados Adicionados com sucesso!");

        document.querySelector("#ordernar-select").value = "Escolha";
        atualizarTabelasEDadosFinanceiro("data", "");

        descricaoInput.value = "";
        observacaoInput.value = "";
        valorInput.value = "";
        categoriaSelect.value = "escolha";
        tipoSelect.value = "entrada";
        // dataInput.value = `${tratarData(new Date()).ano}-${tratarData(new Date()).mes}-${tratarData(new Date()).dia}` // Em vez de tratar a data já irei deixar ela (geralmente será adicionado +1 gasto por dia)

    } else{
        alert("Dados Inválidos!");
    }
})