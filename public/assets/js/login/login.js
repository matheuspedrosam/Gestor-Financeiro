import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
const qs = (el) => document.querySelector(el)

const password = qs("#senha")
const email = qs("#email")

const btnLogin = qs("#btn-login")
btnLogin.addEventListener("click", (event) => {
    event.preventDefault();

    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        window.location = "categorias.html"
        const user = userCredential.user;
      })
      .catch((error) => {
        alert(error.message)
      });
})