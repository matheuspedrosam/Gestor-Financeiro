import { getFirestore, collection, getDocs, where, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { app } from "../firebaseConfig.js";

// Modificar o Header e o Aside;
document.querySelector("main-header h1").innerHTML = "Recorrentes";
document.querySelectorAll("main-aside .asideMenuButtons")[2].classList.add("asideCurrentButton");

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