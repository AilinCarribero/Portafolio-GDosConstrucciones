module.exports = ( sequelize, type ) => {
    return sequelize.define('stock', {
        id_stock: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_stock: type.STRING(100),
        valor: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        valor_unidad: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        cantidad: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        medida: {
            type: type.STRING(20),
            defaultValue: "unidad"
        },
        restante_valor: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        salida: { 
            type: type.DATE,
            defaultValue: type.NOW
        },
        id_user: type.INTEGER
    });
}