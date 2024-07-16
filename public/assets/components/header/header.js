class MainHeader extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
            <span id="menuHamburguer" class="material-symbols-outlined">menu</span>
            <div id="headerContainer">
                <h1></h1>
                <div id="headerIconsContainer">
                    <span id="notificationIcon" class="material-symbols-outlined">notifications</span>
                    <span id="settingsIcon" class="material-symbols-outlined">settings</span>
                </div>
            </div>
        `
    }
}

customElements.define("main-header", MainHeader);