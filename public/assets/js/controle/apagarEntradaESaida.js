import { getFirestore, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelasEDadosFinanceiro } from "./atualizarTabelasEDadosFinanceiros.js";

const db = getFirestore(app);

const tableBodyFinanceiro = document.querySelector(".table-container")

tableBodyFinanceiro.addEventListener("click", async (event) => {
    if(event.target.innerText == "Excluir"){
        await deleteDoc(doc(db, "EntradasESaidas", event.target.parentNode.id));
        document.querySelector("#ordernar-select").value = "Escolha"
        atualizarTabelasEDadosFinanceiro("descricao", "");
    }
})