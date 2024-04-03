import { getFirestore, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelaCategoria } from "./atualizarTabelaCategorias.js";

const db = getFirestore(app);
const table = document.querySelector("table")

table.addEventListener("click", async (event) => {
    if(event.target.innerHTML == "Excluir"){
        if(window.confirm(`Realmente deseja excluir a categoria ( ${event.target.parentNode.children[0].innerText} ) ?`)){
            await deleteDoc(doc(db, "Categorias", event.target.parentNode.id));
        atualizarTabelaCategoria();
        } else{
            alert("Exclusão cancelada!");
            return;
        }
    }
})