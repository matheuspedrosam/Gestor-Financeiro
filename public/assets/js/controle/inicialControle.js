import { getFirestore, collection, getDocs, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { app } from "../firebaseConfig.js";
import { tratarData } from "./functions/tratarData.js";

// Modificar o Header e o Aside;
document.querySelector("main-header h1").innerHTML = "Controle";
document.querySelectorAll("main-aside .asideMenuButtons")[1].classList.add("asideCurrentButton");

// Inserir Datas Nos Inputs:
const dataAtual = new Date();
const dia = tratarData(dataAtual).dia
const ano = tratarData(dataAtual).ano
const mes = tratarData(dataAtual).mes

const inputData = document.querySelector("#input-data")
const inputVisualizarTabelaDoMes = document.querySelector("#mes-tabela-input")

inputData.value = `${ano}-${mes}-${dia}`
inputVisualizarTabelaDoMes.value = `${ano}-${mes}`

// Carregar Categorias:
const db = getFirestore(app);
const auth = await getAuth(app);
const selectCategorias = document.querySelector("#select-categoria")

auth.onAuthStateChanged(async (userCredentials) => {

    const q = await query(collection(db, "Categorias"), where("userID", "==", userCredentials.uid), orderBy("nome"))

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((categoria) => {
        selectCategorias.innerHTML += `
            <option id="${categoria.id}" value="${categoria.data().nome}">${categoria.data().nome}</option>
        `
    })

})

// Modificar Select Class:

selectCategorias.addEventListener("change", () => {
    let optionID = selectCategorias.options[selectCategorias.selectedIndex].id

    selectCategorias.classList = ""
    selectCategorias.classList.add(optionID)
})