exports.busquedaRango = (id) => {
    return `SELECT * FROM rango WHERE id_rango='${id}'`
}