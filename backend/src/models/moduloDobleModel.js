module.exports = ( sequelize, type ) => {
    return sequelize.define('modulo_doble', {
        id_modulo_doble: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_modulo_uno: {
            type: type.INTEGER,
            allowNull: false,
            isNumeric: true
        },
        id_modulo_dos: {
            type: type.INTEGER,
            allowNull: false,
            isNumeric: true
        },
        vinculacion: {
            type: type.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }, 
        estado: {
            type: type.INTEGER,
            allowNull: true,
            defaultValue: 0,
            isNumeric: true
        }
    });
}