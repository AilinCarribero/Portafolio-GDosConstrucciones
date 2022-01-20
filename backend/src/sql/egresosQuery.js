exports.insertEgreso = (datos) => {
    return `INSERT INTO egreso(id_proyecto, fecha_pago, fecha_diferido_pago, id_forma_pago, id_user, id_analisis_costo, valor_pago, valor_usd, observaciones, cuotas, cuota, id_comprobante_pago, numero_comprobante, id_detalle_ac) 
    VALUES (
        '${datos.id_proyecto}',
        '${datos.fecha_pago}',
        '${datos.fecha_diferido_pago}',
        '${datos.id_forma_pago}',
        '${datos.id_user}',
        '${datos.id_analisis_costo}',
        '${datos.valor_pago}',
        '${datos.valor_usd}',
        '${datos.observaciones}',
        '${datos.cuota}',
        '${datos.cuotaNumero}',
        '${datos.id_comprobante_pago}',
        '${datos.numero_comprobante}',
        '${datos.id_detalle_ac}'
        )`
}

exports.listEgresos = () => {
    return `SELECT egreso.id_egreso, egreso.id_proyecto, egreso.fecha_pago, egreso.fecha_diferido_pago, egreso.cuota, egreso.cuotas,
    forma_pago.forma_pago, user.nombre_apellido, analisis_costo.analisis_costo, 
    egreso.valor_pago, egreso.valor_usd, egreso.observaciones, egreso.numero_comprobante,
    comprobante_pago.tipo_comprobante, comprobante_pago.nombre_comprobante
    FROM ((((egreso AS egreso 
    INNER JOIN forma_pago AS forma_pago ON egreso.id_forma_pago=forma_pago.id_forma_pago)
    INNER JOIN usuario AS user ON egreso.id_user=user.id_user)
    INNER JOIN analisis_costo AS analisis_costo ON egreso.id_analisis_costo=analisis_costo.id_analisis_costo)
    INNER JOIN comprobante_pago AS comprobante_pago ON egreso.id_comprobante_pago=comprobante_pago.id_comprobante_pago) 
    `
}

exports.listEgresosId = (id) => {
    return `SELECT egreso.id_egreso, egreso.id_proyecto, egreso.fecha_pago, egreso.fecha_diferido_pago, egreso.cuota, egreso.cuotas,
    forma_pago.forma_pago, user.nombre_apellido, analisis_costo.analisis_costo, 
    egreso.valor_pago, egreso.valor_usd, egreso.observaciones, egreso.numero_comprobante,
    comprobante_pago.tipo_comprobante, comprobante_pago.nombre_comprobante
    FROM ((((egreso AS egreso 
    INNER JOIN forma_pago AS forma_pago ON egreso.id_forma_pago=forma_pago.id_forma_pago)
    INNER JOIN usuario AS user ON egreso.id_user=user.id_user)
    INNER JOIN analisis_costo AS analisis_costo ON egreso.id_analisis_costo=analisis_costo.id_analisis_costo)
    INNER JOIN comprobante_pago AS comprobante_pago ON egreso.id_comprobante_pago=comprobante_pago.id_comprobante_pago) 
    WHERE id_proyecto='${id}' ORDER BY fecha_pago desc
    `
}