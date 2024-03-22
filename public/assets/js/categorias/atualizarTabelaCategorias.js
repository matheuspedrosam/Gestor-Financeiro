import { getFirestore, collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { inserirDadosNaTabela } from "./functions/inserirDadosNaTabela.js";
import { loaderAnimationOFF, loaderAnimationON } from "./functions/loaderAnimations.js";

const db = getFirestore(app);
const auth = await getAuth();

const tableBody = document.querySelector("table tbody")

export function atualizarTabelaCategoria(){
    
    tableBody.innerHTML = ""
    loaderAnimationON();

    auth.onAuthStateChanged(async (userCredentials) => {
        const q = await query(collection(db, "Categorias"), where("userID", "==", userCredentials.uid))
        const querySnapshot = await getDocs(q);
    
        querySnapshot.forEach((categoria) => {
            inserirDadosNaTabela(categoria)
        })
    
    })

    loaderAnimationOFF();
}
atualizarTabelaCategoria();