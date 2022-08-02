module.exports = ( sequelize, type ) => {
    return sequelize.define('stock_movimiento', {
        id_movimiento: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_stock: {
            type: type.INTEGER,
            isNumeric: true
        },
        cantidad: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        valor_unidad: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        valor_total: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        medida: {
            type: type.STRING(20),
            defaultValue: "unidad"
        },
        id_user: type.INTEGER
    });
}