import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const auth = getAuth();

const logoutBtn = document.querySelector("#button-logout")

logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();

    auth.signOut();

    window.location = "login.html";
})