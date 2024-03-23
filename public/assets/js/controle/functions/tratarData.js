export function tratarData(data){

    const dia = data.getDate() < 10 ? `0${data.getDate()}` : data.getDate();
    const mes = data.getMonth() + 1 < 10 ? `0${data.getMonth() + 1}` : data.getMonth() + 1;
    const ano = data.getFullYear();

    return {
        dia: dia,
        mes: mes,
        ano: ano
    }

}