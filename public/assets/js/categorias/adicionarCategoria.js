import { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelaCategoria } from "./atualizarTabelaCategorias.js";
import { inserirDadosNaTabela } from "./functions/inserirDadosNaTabela.js";

const db = getFirestore(app);
const auth = await getAuth();

const inputCategoria = document.querySelector("#input-categoria");
const selectClasseCategoria = document.querySelector("#select-categoria-classe");

async function validarInputCategoria(categoria, userCredentials){
    if(categoria == "") return false;
    
    let apenasLetrasRegexp = /^[a-záàâãéèêíïóôõöúçñ ()]+$/i;
    if(!apenasLetrasRegexp.test(categoria)) return false;

    const categoriasComMesmoNome = [];

    const q = await query(collection(db, "Categorias"), where("userID", "==", userCredentials.uid), where("nome", "==", formatarString(categoria)));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(dados => {
        categoriasComMesmoNome.push(dados.data().nome);
    })
    
    if(categoriasComMesmoNome.length > 0) return false;

    return true;
}

const btnAdicionarCategoria = document.querySelector("#btn-adicionar-categoria");

btnAdicionarCategoria.addEventListener("click", async () => {
    const $nomeCategoriaParaEnviarBanco = formatarString(inputCategoria.value);
    const $selectClasseCategoriaParaEnviarBanco = selectClasseCategoria.value;
    
    auth.onAuthStateChanged(async (userCredentials) => {

        if(await validarInputCategoria(inputCategoria.value, userCredentials)){

            const retorno = await addDoc(collection(db, "Categorias"), {
                    userID: userCredentials.uid,
                    nome: $nomeCategoriaParaEnviarBanco,
                    classe: $selectClasseCategoriaParaEnviarBanco
            });

            //Isso vai evitar ler varios dados sempre que adicionar. (Em vez de chamar a função atualizar tabela inteira)
            const categoriaAdicionada = await getDoc(doc(db, "Categorias", retorno._key.path.segments[1]))

            inserirDadosNaTabela(categoriaAdicionada);
            
            alert("Categoria adicionada com sucesso!");
            inputCategoria.value = "";
            
            // atualizarTabelaCategoria();
        } else{
            alert("Dados inseridos Inválidos!");
        }

    })  
})

function formatarString(string){
    // Para ficar primeira letra maiuscula e sem espaço no começo e depois
    if(string != ""){
        let stringFormatada = string.trimStart().trimEnd()
        return `${stringFormatada.charAt(0).toUpperCase()}${stringFormatada.substring(1)}`
    } else {
        return string;
    }
}