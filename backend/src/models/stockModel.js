module.exports = ( sequelize, type ) => {
    return sequelize.define('stock', {
        id_stock: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_stock: type.STRING(100),
        tipo: type.STRING(60),
        valor: type.DOUBLE,
        restante_valor: type.DOUBLE,
        salida: { 
            type: type.DATE,
            defaultValue: type.NOW
        }
    });
}