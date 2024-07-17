import { getFirestore, collection, getDocs, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { app } from "../firebaseConfig.js";
import { tratarData } from "./functions/tratarData.js";

// Modificar o Header e o Aside;
document.querySelector("main-header h1").innerHTML = "Transações";
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

// Carregar Categorias (TANTO INPUT NORMAL COMO NO INPUT DO MODAL DE EDITAR):
const db = getFirestore(app);
const auth = await getAuth(app);
const selectCategorias = document.querySelector("#select-categoria")
const EditarselectCategorias = document.querySelector("#editar-select-categoria")

auth.onAuthStateChanged(async (userCredentials) => {

    const q = await query(collection(db, "Categorias"), where("userID", "==", userCredentials.uid), orderBy("nome"))

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((categoria) => {
        selectCategorias.innerHTML += `
            <option id="${categoria.id}" value="${categoria.data().nome}">${categoria.data().nome}</option>
        `
    })

    querySnapshot.forEach((categoria) => {
        EditarselectCategorias.innerHTML += `
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

EditarselectCategorias.addEventListener("change", () => {
    let optionID = EditarselectCategorias.options[EditarselectCategorias.selectedIndex].id

    EditarselectCategorias.classList = ""
    EditarselectCategorias.classList.add(optionID)
})