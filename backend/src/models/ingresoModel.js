module.exports = ( sequelize, type ) => {
    return sequelize.define('ingreso', {
        id_ingreso: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_proyecto: type.STRING(100),
        fecha_cobro:{ 
            type: type.DATE,
            defaultValue: type.NOW
        },
        fecha_diferido_cobro: { 
            type: type.DATE,
            allowNull: true,
            defaultValue: null
        },
        id_forma_cobro: {
            type: type.INTEGER,
            isNumeric: true
        },
        id_user: {
            type: type.INTEGER,
            isNumeric: true
        },
        valor_cobro: type.DOUBLE,
        cuotas: {
            type: type.INTEGER,
            isNumeric: true
        },
        cuota: {
            type: type.INTEGER,
            isNumeric: true
        },
        observaciones: type.STRING(100),
        valor_usd: type.DOUBLE,
    });
}