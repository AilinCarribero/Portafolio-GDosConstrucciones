exports.busquedaIdUnidadNegocio = (id) => {
    return `SELECT * FROM unidad_negocio WHERE id_unidad_negocio='${id}'`
}

exports.selectUnidadNegocio = () => {
    return `SELECT * FROM unidad_negocio`
}