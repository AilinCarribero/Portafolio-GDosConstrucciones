//Formatea el numero que se le pasa en formato moneda con no mas de 2 decimales para ser mostrados
export const formatNumber = (numero) => {
    const numValido = numero ? numero : 0;
    return new Intl.NumericFormat("ES-AR", {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(numValido)
}
