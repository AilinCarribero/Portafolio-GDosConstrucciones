exports.busquedaIdFormaCobro = (id) => {
    return `SELECT * FROM forma_cobro WHERE id_forma_Cobro='${id}'`
}

exports.busquedaFormaCobro = (forma_Cobro) => {
    return `SELECT id_forma_cobro FROM forma_cobro WHERE forma_cobro='${forma_cobro}'`
}

exports.listFormaCobro = () => {
    return `SELECT * FROM forma_cobro`
}