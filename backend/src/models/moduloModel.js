module.exports = ( sequelize, type ) => {
    return sequelize.define('modulo', {
        id_modulo: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_modulo: {
            type: type.STRING(100)
        },
        costo: {
            type:type.DOUBLE,
            defaultValue: 0
        },
        venta: {
            type:type.DOUBLE,
            defaultValue: 0
        },
        fecha_creacion:{ 
            type: type.DATE,
            defaultValue: type.NOW
        },
        fecha_venta: { 
            type: type.DATE,
            allowNull: true,
            defaultValue: null
        },
        estado: {
            type: type.INTEGER,
            isNumeric: true
        },
        descripcion: {
            type: type.STRING(500),
            defaultValue: null
        }
    });
}