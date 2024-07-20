class Aside extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
            <img id="aside-logo" src="assets/imgs/IconGestor.png" alt="logo sootz">
            <nav>
                <ul>
                    <span class="AsideButtonsTitle">Gestão</span>
                    <a href="categorias.html">
                        <li class="asideMenuButtons">
                            <span class="material-symbols-outlined aside-icons">stacks</span>
                            <span class="navNames">Categorias</span>
                        </li>
                    </a>
                    <a href="controle.html">
                        <li class="asideMenuButtons">
                            <span class="material-symbols-outlined aside-icons">payments</span>
                            <span class="navNames">Transações</span>
                        </li>
                    </a>
                    <a href="recorrentes.html">
                        <li class="asideMenuButtons">
                            <span class="material-symbols-outlined aside-icons">cached</span>
                            <span class="navNames">Recorrentes</span>
                        </li>
                    </a>
                    <a href="cartao.html">
                        <li class="asideMenuButtons">
                            <span class="material-symbols-outlined aside-icons">credit_card</span>
                            <span class="navNames">Gastos Cartão</span>
                        </li>
                    </a>
                    <a href="dashboard.html">
                        <li class="asideMenuButtons">
                            <span class="material-symbols-outlined aside-icons">trending_up</span>
                            <span class="navNames">Dashboard</span>
                        </li>
                    </a>
                    <span class="AsideButtonsTitle">Anotações</span>
                    <a href="observacoes.html">
                        <li class="asideMenuButtons">
                            <span class="material-symbols-outlined aside-icons">chat</span>
                            <span class="navNames">Observações</span>
                        </li>
                    </a>
                    <span class="AsideButtonsTitle">Outros</span>
                    <a href="" id="logoutButton">
                        <li class="asideMenuButtons">
                            <span class="material-symbols-outlined">logout</span>
                            <span class="navNames">Sair</span>
                        </li>
                    </a>
                </ul>
            </nav>
            <a href="perfil.html">
                <div id="userContainer">
                    <img id="userPhoto" src="https://cdn-icons-png.freepik.com/512/3177/3177440.png" alt="foto do usuário">
                    <p id="userName" class="navNames">UserName</p>
                </div>
            </a>
        `
    }
}

customElements.define("main-aside", Aside);