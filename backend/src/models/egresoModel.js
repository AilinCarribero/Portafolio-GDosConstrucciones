module.exports = ( sequelize, type ) => {
    return sequelize.define('egreso', {
        id_egreso: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_proyecto: type.STRING(100),
        fecha_pago:{ 
            type: type.DATE,
            defaultValue: type.NOW
        },
        fecha_diferido_pago: { 
            type: type.DATE,
            allowNull: true,
            defaultValue: null
        },
        id_forma_pago: {
            type: type.INTEGER,
            isNumeric: true
        },
        id_user: {
            type: type.INTEGER,
            isNumeric: true
        },
        id_analisis_costo: {
            type: type.INTEGER,
            isNumeric: true
        },
        valor_pago: type.DOUBLE,
        observaciones: type.STRING(100),
        proveedor: type.STRING(100),
        cuotas: {
            type: type.INTEGER,
            isNumeric: true
        },
        cuota: {
            type: type.INTEGER,
            isNumeric: true
        },
        id_comprobante_pago: {
            type: type.INTEGER,
            defaultValue: '6',
            isNumeric: true
        },
        numero_comprobante: type.STRING(100),
        id_detalle_ac: {
            type: type.INTEGER,
            isNumeric: true
        },
        id_stock: {
            type: type.INTEGER
        },
        valor_usd: type.DOUBLE,
    });
}
