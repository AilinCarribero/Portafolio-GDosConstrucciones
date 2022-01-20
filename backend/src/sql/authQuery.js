exports.buscarNombre = (nombre) => {
    return `SELECT id_user FROM usuario WHERE nombre_apellido='${nombre}'`
}

exports.busquedaIdUser = (id) => {
    return `SELECT * FROM usuario WHERE id_user='${id}'`
}

exports.login = (correo) => {
    return `SELECT * 
    FROM (usuario AS usuario 
    INNER JOIN rango AS rango ON usuario.id_rango=rango.id_rango)
    WHERE correo='${correo}'`
}

exports.selectUsers = () => {
    return `SELECT * 
    FROM (usuario AS usuario 
    INNER JOIN rango AS rango ON usuario.id_rango=rango.id_rango)`
}