exports.listProyectos = () => {
    return `SELECT * FROM proyecto `
}
//INNER JOIN gdosconstrucciones.ingreso AS ingreso ON proyecto.id_proyecto=ingreso.id_proyecto)

exports.insertProyecto = (datos) => {
    return `INSERT INTO proyecto(id_proyecto, id_unidad_negocio, id_centro_costo, cliente, costo, venta, fecha_i_proyecto, fecha_f_proyecto, id_estado) 
    VALUES (
        '${datos.id_proyecto}',
        '${datos.id_unidad_negocio}',
        '${datos.id_centro_costo}',
        '${datos.cliente}',
        '${datos.costo}',
        '${datos.venta}',
        '${datos.fecha_i_proyecto}',
        '${datos.fecha_f_proyecto}',
        '${datos.id_estado}')`

}