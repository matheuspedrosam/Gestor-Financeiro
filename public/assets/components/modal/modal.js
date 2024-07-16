class ComponentModal extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
            <div id="close-btn">
                <span class="material-symbols-outlined">
                    close
                </span>
            </div>
        `
    }
}

customElements.define("component-modal", ComponentModal);