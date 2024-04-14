import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";

const textArea = document.querySelector("#mytextarea")

const db = getFirestore(app);
const auth = await getAuth();

auth.onAuthStateChanged(async (userCredentials) => {
    
    const docSnap = await getDoc(doc(db, "Observacoes", userCredentials.uid));
    
    let retorno;

    if(docSnap.exists()){
        retorno = docSnap.data().valor;
    } else {
        retorno = "";
    }

    tinymce.init({
        selector: '#mytextarea',
        plugins: 'autoresize',
        setup: (editor) => {
          editor.on('init', () => {
            editor.setContent(`${retorno}`);
          });
          editor.on('change', (e) => {
            document.querySelector("#alerta").style.display = "inline";
          })
        }
    });

})



const btnSalvarMudancas = document.querySelector("#salvar-mudancas-btn");

btnSalvarMudancas.addEventListener("click", async (event) => {
    event.preventDefault();

    auth.onAuthStateChanged(async (userCredentials) => {
        await setDoc(doc(db, "Observacoes", userCredentials.uid), {
          valor: tinymce.activeEditor.getContent({ format: 'html' })
        });
    })

    document.querySelector("#alerta").style.display = "none";
    alert("Dados Salvos com sucesso!");
});