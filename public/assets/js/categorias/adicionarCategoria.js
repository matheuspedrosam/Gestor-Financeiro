import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelaCategoria } from "./atualizarTabelaCategorias.js";

const db = getFirestore(app);
const auth = await getAuth();

const inputCategoria = document.querySelector("#input-categoria")
const selectClasseCategoria = document.querySelector("#select-categoria-classe")

function validarInputCategoria(categoria){
    if(categoria == "") return false;
    
    let apenasLetrasRegexp = /^[a-záàâãéèêíïóôõöúçñ ]+$/i;
    if(!apenasLetrasRegexp.test(categoria)) return false;

    return true;
}

const btnAdicionarCategoria = document.querySelector("#btn-adicionar-categoria")

btnAdicionarCategoria.addEventListener("click", async () => {
    const $nomeCategoriaParaEnviarBanco = inputCategoria.value
    const $selectClasseCategoriaParaEnviarBanco = selectClasseCategoria.value
    
    if(validarInputCategoria(inputCategoria.value)){
        auth.onAuthStateChanged(async (userCredentials) => {
            await addDoc(collection(db, "Categorias"), {
                    userID: userCredentials.uid,
                    nome: $nomeCategoriaParaEnviarBanco.trimLeft().trimRight(),
                    classe: $selectClasseCategoriaParaEnviarBanco
                });
        })
        
        alert("Categoria adicionada com sucesso!")
        
        atualizarTabelaCategoria();

        inputCategoria.value = ""
    } else{
        alert("Dados inseridos Inválidos!")
    }

})