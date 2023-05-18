module.exports = ( sequelize, type ) => {
    return sequelize.define('cliente', {
        id_cliente: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING(60),
        correo: {
            type: type.STRING(100),
            defaultValue: null,
            validator: {
                isEmail: true
            }
        },
        telefono: {
            type: type.STRING(14),
        },
        direccion: {
            type: type.STRING(150),
        }
    });
}