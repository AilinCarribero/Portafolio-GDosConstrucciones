exports.busquedaIdAnalisisCosto = (id) => {
    return `SELECT * FROM analisis_costo WHERE id_analisis_costo='${id}'`
}

exports.busquedaAnalisisCosto = (analisis_costo) => {
    return `SELECT id_analisis_costo FROM analisis_costo WHERE analisis_costo='${analisis_costo}'`
}

exports.selectAnalisisCosto = () => {
    return `SELECT * FROM analisis_costo`
}