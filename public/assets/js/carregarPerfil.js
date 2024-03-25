import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const auth = await getAuth();
const imgPerfil = document.querySelector("#img-perfil-container img")
const userName = document.querySelector("#user-name")

auth.onAuthStateChanged((userCredentials) => {
    userName.innerHTML = userCredentials.email.split("@")[0]
    if (userCredentials.email == "emydoriane@gmail.com"){
        imgPerfil.src = "./assets/imgs/FotoMae.png"
    } else if(userCredentials.email == "apartamentospajucara@gmail.com"){
        imgPerfil.src = "./assets/imgs/ApartamentosPajucara.png"
    } else{
        imgPerfil.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
})