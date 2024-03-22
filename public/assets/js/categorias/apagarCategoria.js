import { getFirestore, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { app } from "../firebaseConfig.js";
import { atualizarTabelaCategoria } from "./atualizarTabelaCategorias.js";

const db = getFirestore(app);
const table = document.querySelector("table")

table.addEventListener("click", async (event) => {
    if(event.target.innerHTML == "Excluir"){
        await deleteDoc(doc(db, "Categorias", event.target.parentNode.id));
        atualizarTabelaCategoria();
    }
})