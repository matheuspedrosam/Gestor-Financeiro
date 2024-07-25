import { getFirestore, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelasEDadosFinanceiro } from "./atualizarTabela.js";

const db = getFirestore(app);

const tableBodyFinanceiro = document.querySelector(".table-container")

tableBodyFinanceiro.addEventListener("click", async (event) => {
    if(event.target.innerText == "Excluir"){
        if(window.confirm(`Realmente deseja excluir ( ${event.target.parentNode.children[0].innerText} ) ?`)){
            await deleteDoc(doc(db, "Emprestimos", event.target.parentNode.id));
            document.querySelector("#ordernar-select").value = "Escolha"
            atualizarTabelasEDadosFinanceiro("data", "");
        } else{
            alert("Exclusão cancelada!");
            return;
        }
    }
})