const pageContainer = document.querySelector("#pageContainer");
const hideAsideBtn = document.querySelector("#menuHamburguer");

const aside = document.querySelector("main-aside");
const main = document.querySelector("main");
const asideLogo = document.querySelector("#aside-logo");

let asideOpen = false;

hideAsideBtn.addEventListener("click", () => {
    if(asideOpen){
        asideOpen = false;
        pageContainer.classList.remove("pageContainerAsideOpen");
        pageContainer.classList.add("pageContainerAsideClosed");

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


// HOVER METHOD:

// let asideOpen = false;
// let vezes = 0;

// function openAside(){
//     asideOpen = true;
//     pageContainer.classList.remove("pageContainerAsideClosed");
//     pageContainer.classList.add("pageContainerAsideOpen");

//     asideLogo.classList.remove("logoAnimationClose");
//     asideLogo.classList.add("logoAnimationOpen");
    
//     setTimeout(() => {
//         aside.classList.remove("asideClosed");
//     }, 150)
// }

// function closeAside(){
//     asideOpen = false;
//     setTimeout(() => {
//         asideOpen = false;
//         pageContainer.classList.remove("pageContainerAsideOpen");
//         pageContainer.classList.add("pageContainerAsideClosed")
    
//         asideLogo.classList.remove("logoAnimationOpen");
//         asideLogo.classList.add("logoAnimationClose");
    
//         aside.classList.add("asideClosed");
//     }, 200);
// }

// setTimeout(() => {
//     aside.addEventListener('mouseenter', () => {
//         openAside();
//     })
    
//     main.addEventListener('mouseenter', () => {
//         if(vezes == 0){
//             vezes += 1;
//             if(!asideOpen){
//                 return;
//             } else{
//                 closeAside();
//             }
//         } else{
//             closeAside();
//         }
//     })
// }, 500)