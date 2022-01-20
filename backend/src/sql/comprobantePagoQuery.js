exports.selectComprobantePago = () => {
    return `SELECT * FROM comprobante_pago`
}

exports.selectComprobantePagoId = (id) => {
    return `SELECT * FROM comprobante_pago WHERE id_comprobante_pago='${id}'`
}