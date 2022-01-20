exports.busquedaIdCentroCosto = (id) => {
    return `SELECT * FROM centro_costo WHERE id_centro_costo='${id}'`
}

exports.selectCentroCosto = () => {
    return `SELECT * FROM centro_costo`
}