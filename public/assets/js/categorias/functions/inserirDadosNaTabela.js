export function inserirDadosNaTabela(categoria){
    let metaDeGasto;
    if (categoria.data().metaGasto == undefined){
        metaDeGasto = "";
    } else{
        metaDeGasto = categoria.data().metaGasto.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
    }

    const tableBody = document.querySelector("table tbody")

    tableBody.innerHTML += `
        <tr id="${categoria.id}">
            <td>${categoria.data().nome}</td>
            <td>${categoria.data().classe}</td>
            <td>${metaDeGasto}</td>
            <td>Editar</td>
            <td>Excluir</td>
        </tr>
    `

}