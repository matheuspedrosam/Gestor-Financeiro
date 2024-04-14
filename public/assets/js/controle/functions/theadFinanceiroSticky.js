const tableFinanceiroContainer = document.querySelector("#table-financeiro-container");
const tableFinanceiroThead = document.querySelector("#table-financeiro thead");

console.log(tableFinanceiroContainer);

tableFinanceiroContainer.addEventListener("scroll", () => {
    if(tableFinanceiroContainer.scrollTop > 10){
        tableFinanceiroThead.classList.add("position-sticky");
    } else{
        tableFinanceiroThead.classList.remove("position-sticky");
    }
})