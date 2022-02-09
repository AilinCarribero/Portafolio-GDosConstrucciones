exports.busquedaIdModulo = (id) => {
    return `SELECT * FROM modulo WHERE id_modulo='${id}'`
}

exports.selectModulo = () => {
    return `SELECT * FROM modulo`
}

exports.insertModulo = (datos) => {
    return `INSERT INTO modulo(nombre_modulo, costo, venta, fecha_venta, fecha_creacion, estado) 
    VALUES (
        '${datos.nombre_modulo}',
        '${datos.costo}',
        '${datos.venta}',
        '${datos.fecha_venta}',
        '${datos.fecha_creacion}',
        '${datos.estado}')`
}