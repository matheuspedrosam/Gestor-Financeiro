import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const auth = await getAuth();
const imgPerfil = document.querySelector("#img-perfil-container img")

auth.onAuthStateChanged((userCredentials) => {
    // console.log(userCredentials)
    if (userCredentials.email == "emydoriane@gmail.com"){
        imgPerfil.src = "../public/assets/imgs/FotoMae.png"
    } else if(userCredentials.email == "apartamentospajucara@gmail.com"){
        imgPerfil.src = "../public/assets/imgs/ApartamentosPajucara.png"
    } else{
        imgPerfil.src = "https://cdn-icons-png.flaticon.com/512/2098/2098439.png"
    }
})