exports.busquedaEstado = (id) => {
    return `SELECT * FROM estado WHERE id_estado='${id}'`
}