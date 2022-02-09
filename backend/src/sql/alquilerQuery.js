exports.busquedaIdAlquiler = (id) => {
    return `SELECT * FROM alquiler WHERE id_alquiler='${id}'`
}

exports.selectAlquiler = () => {
    return `SELECT * FROM alquiler`
}

/**REVISAR**/
exports.insertAlquiler = (datos) => {
    return `INSERT INTO proyecto(nombre_modulo, costo, venta, fecha_venta, fecha_creacion) 
    VALUES (
        '${datos.nombre_modulo}',
        '${datos.costo}',
        '${datos.venta}',
        '${datos.fecha_venta}',
        '${datos.fecha_creacion}')`
}