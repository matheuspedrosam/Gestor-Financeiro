import { getFirestore, doc, setDoc, addDoc, getDoc, getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { tratarData } from "../controle/functions/tratarData.js";

localStorage.clear();

const mesObservacaoInput = document.querySelector("#mes-observacao-input");

const db = getFirestore(app);
const auth = await getAuth(app);
let totalAlteracoes = 0;

mesObservacaoInput.addEventListener("change", () => {
  tinymce.activeEditor.remove("textarea");
  atualizarObservacao();
});

function atualizarObservacao(){
  auth.onAuthStateChanged(async (userCredentials) => {
    const mestAtualSelecionadoNoInput = String(tratarData(new Date(`${mesObservacaoInput.value}-01 00:00:00`)).mes);
    const anotAtualSelecionadoNoInput = String(tratarData(new Date(`${mesObservacaoInput.value}-01 00:00:00`)).ano);
    
    const q = await query(collection(db, "Observacoes"), where("userID", "==", userCredentials.uid), where("mes", "==", mestAtualSelecionadoNoInput), where("ano", "==", anotAtualSelecionadoNoInput));
    const docSnap = await getDocs(q);
    
    let retorno;
    if(docSnap.docs[0] == undefined){
      retorno = "";
      localStorage.removeItem("observacaoID");
    } else {
      docSnap.forEach((observacao) => {
          retorno = observacao.data().valor;
          localStorage.setItem("observacaoID", observacao.id);
      })
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
            if(totalAlteracoes == 0){
              alert("Cuidado, você possui alterações não salvas. Para Salvar basta clicar no botão azul 'Salvar Alterações' no final da página!");
              totalAlteracoes += 1;
            }
          })
        }
    });
  })
}

atualizarObservacao();



const btnSalvarMudancas = document.querySelector("#salvar-mudancas-btn");

btnSalvarMudancas.addEventListener("click", async (event) => {
    event.preventDefault();

    const mestAtualSelecionadoNoInput = String(tratarData(new Date(`${mesObservacaoInput.value}-01 00:00:00`)).mes);
    const anotAtualSelecionadoNoInput = String(tratarData(new Date(`${mesObservacaoInput.value}-01 00:00:00`)).ano);

    let objetoAdicionado;
    auth.onAuthStateChanged(async (userCredentials) => {
      if(!localStorage.getItem("observacaoID")){
        objetoAdicionado = await addDoc(collection(db, "Observacoes"), {
          valor: tinymce.activeEditor.getContent({ format: 'html' }),
          userID: userCredentials.uid,
          mes: mestAtualSelecionadoNoInput,
          ano: anotAtualSelecionadoNoInput,
        });
        localStorage.setItem("observacaoID", objetoAdicionado.id);
      } else {
        await setDoc(doc(db, "Observacoes", localStorage.getItem("observacaoID")), {
          valor: tinymce.activeEditor.getContent({ format: 'html' }),
          userID: userCredentials.uid,
          mes: mestAtualSelecionadoNoInput,
          ano: anotAtualSelecionadoNoInput,
        });
      }
    })

    document.querySelector("#alerta").style.display = "none";
    totalAlteracoes = 0;
    alert("Dados Salvos com sucesso!");
});