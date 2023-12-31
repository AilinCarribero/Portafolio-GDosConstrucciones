module.exports = ( sequelize, type ) => {
    return sequelize.define('alquiler', {
        id_alquiler: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_modulo: {
            type: type.INTEGER,
            isNumeric: true,
            allowNull: true,
            defaultValue: null
        },
        id_modulo_doble: {
            type: type.INTEGER,
            isNumeric: true,
            allowNull: true,
            defaultValue: null
        },
        id_proyecto: {
            type: type.STRING(100),
        },
        valor: {
            type: type.DOUBLE
        },
        fecha_d_alquiler:{ 
            type: type.DATE,
            defaultValue: type.NOW
        },
        fecha_h_alquiler: { 
            type: type.DATE,
            allowNull: true,
            defaultValue: null
        }
    });
}