import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const auth = await getAuth(app);

const imgPerfil = document.querySelector("main-aside #userPhoto")
const userName = document.querySelector("main-aside #userName")

//Carregar Perfil
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location = "login.html"; //Caso user não esteja logado
    } else {
        userName.innerHTML = user.email.split("@")[0]
        if (user.email == "emydoriane@gmail.com"){
            imgPerfil.src = "./assets/imgs/FotoMae.png"
        } else if(user.email == "apartamentospajucara@gmail.com"){
            imgPerfil.src = "./assets/imgs/ApartamentosPajucara.png"
        } else if(user.email == "juliasalbq@gmail.com"){
            imgPerfil.src = "./assets/imgs/FotoJulia.jpg"
        } else if(user.email == "gallo14bis@gmail.com"){
            imgPerfil.src = "./assets/imgs/FotoGallo.png"
        } else if(user.email == "matheuspedrosa2002@gmail.com"){
            imgPerfil.src = "./assets/imgs/FotoEu.jpg"
        } else {
            imgPerfil.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
    }
  });


// Logout
const logoutBtn = document.querySelector("#logoutButton")

logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();

    auth.signOut();

    window.location = "login.html";
})