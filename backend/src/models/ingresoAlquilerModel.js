module.exports = ( sequelize, type ) => {
    return sequelize.define('ingreso_alquiler', {
        id_ingreso_alquiler: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_proyecto: type.STRING(100),
        id_alquiler: {
            type: type.INTEGER,
            isNumeric: true
        },
        fecha_desde_cobro:{ 
            type: type.DATE,
            defaultValue: type.NOW
        },
        fecha_hasta_cobro:{ 
            type: type.DATE,
            defaultValue: type.NOW
        },
        id_user: {
            type: type.INTEGER,
            isNumeric: true
        },
        valor_arg: type.DOUBLE,
        valor_usd: type.DOUBLE,
        factura: {
            type: type.STRING(100),
            defaultValue: null
        },
        observaciones: type.STRING(100),
    });
}