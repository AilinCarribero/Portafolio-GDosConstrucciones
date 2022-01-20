exports.busquedaIdFormaPago = (id) => {
    return `SELECT * FROM forma_pago WHERE id_forma_pago='${id}'`
}

exports.busquedaFormaPago = (forma_pago) => {
    return `SELECT id_forma_pago FROM forma_pago WHERE forma_pago='${forma_pago}'`
}

exports.listFormaPago = () => {
    return `SELECT * FROM forma_pago`
}