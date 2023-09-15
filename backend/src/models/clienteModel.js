module.exports = ( sequelize, type ) => {
    return sequelize.define('cliente', {
        id_cliente: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cuit_cuil: {
            type: type.STRING(15),
            unique: true
        },
        nombre: type.STRING(60),
        razon_social: type.STRING(60),
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