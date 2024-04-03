import { getFirestore, doc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { validarInputCategoria } from "./adicionarCategoria.js";
import { atualizarTabelaCategoria } from "./atualizarTabelaCategorias.js";

const tableBody = document.querySelector("#table-container tbody")

const modalContainer = document.querySelector("#modal-container")
const inputEditarCategoria = document.querySelector("#input-editar-categoria")
const selectEditarCategoriaClasse = document.querySelector("#select-editar-categoria-classe")
const inputEditarGastosCategoria = document.querySelector("#input-editar-gastos-categoria")

let documentID;
tableBody.addEventListener("click", (event) => {

    if (event.target.innerHTML == "Editar"){
        documentID = event.target.parentNode.id;

        modalContainer.classList.remove("hide");
        window.scrollTo({
            behavior: "smooth", top: 0, left: 0
        })
        document.body.style.overflow = "hidden";

        inputEditarCategoria.value = event.target.parentNode.children[0].innerHTML
        selectEditarCategoriaClasse.value = event.target.parentNode.children[1].innerHTML
        inputEditarGastosCategoria.value = event.target.parentNode.children[2].innerHTML.replace("R$&nbsp;", "").replace(".", "").replace(",", "").slice(0, -2)
    }

})

const closeBtn = document.querySelector("#close-btn span")

function fecharModal(){
    modalContainer.classList.add("hide");
    document.body.style.overflow = "auto";
}

closeBtn.addEventListener("click", fecharModal)

const atualizarCategoriaBtn = document.querySelector("#btn-atualizar-categoria")

const db = await getFirestore(app);
const auth = await getAuth();

atualizarCategoriaBtn.addEventListener("click", () => {
    auth.onAuthStateChanged(async (userCredentials) => {
        if(await validarInputCategoria(inputEditarCategoria.value, inputEditarGastosCategoria, userCredentials, true)){
            if(inputEditarGastosCategoria.value == ""){
                await updateDoc(doc(db, "Categorias", documentID), {
                    nome: inputEditarCategoria.value,
                    classe: selectEditarCategoriaClasse.value,
                    metaGasto: deleteField()
                });
            } else {
                await updateDoc(doc(db, "Categorias", documentID), {
                    nome: inputEditarCategoria.value,
                    classe: selectEditarCategoriaClasse.value,
                    metaGasto: Number(inputEditarGastosCategoria.value)
                });
            }
            
            alert("dados Atualizados com sucesso!");
            fecharModal();
            atualizarTabelaCategoria();
        } else{
            alert("dados inválidos!");
        }
    })

})