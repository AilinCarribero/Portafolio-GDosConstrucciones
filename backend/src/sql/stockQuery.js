exports.busquedaIdStock = (id) => {
    return `SELECT * FROM stock WHERE id_stock='${id}'`
}

exports.selectStock = () => {
    return `SELECT * FROM stock`
}