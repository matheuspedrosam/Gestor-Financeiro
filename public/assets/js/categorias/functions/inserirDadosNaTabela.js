export function inserirDadosNaTabela(categoria){

    const tableBody = document.querySelector("table tbody")

    tableBody.innerHTML += `
        <tr id="${categoria.id}">
            <td>${categoria.data().nome}</td>
            <td>${categoria.data().classe}</td>
            <td>Excluir</td>
        </tr>
    `

}