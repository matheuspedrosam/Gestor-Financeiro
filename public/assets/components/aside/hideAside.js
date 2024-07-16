const pageContainer = document.querySelector("#pageContainer");
const hideAsideBtn = document.querySelector("#menuHamburguer");

const aside = document.querySelector("main-aside");
const asideLogo = document.querySelector("#aside-logo");

let asideOpen = false;

hideAsideBtn.addEventListener("click", () => {

    if(asideOpen){
        asideOpen = false;
        pageContainer.classList.remove("pageContainerAsideOpen");
        pageContainer.classList.add("pageContainerAsideClosed")

        asideLogo.classList.remove("logoAnimationOpen");
        asideLogo.classList.add("logoAnimationClose");

        aside.classList.add("asideClosed");
    } else {
        asideOpen = true;
        pageContainer.classList.remove("pageContainerAsideClosed");
        pageContainer.classList.add("pageContainerAsideOpen");

        asideLogo.classList.remove("logoAnimationClose");
        asideLogo.classList.add("logoAnimationOpen");
        
        setTimeout(() => {
            aside.classList.remove("asideClosed");
        }, 150)
    }

})