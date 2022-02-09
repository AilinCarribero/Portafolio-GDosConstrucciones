exports.busquedaIdIndice = (id) => {
    return `SELECT * FROM indice WHERE id_indice='${id}'`
}

exports.selectIndice = () => {
    return `SELECT * FROM indice`
}