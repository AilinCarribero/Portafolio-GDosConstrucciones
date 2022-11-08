module.exports = ( sequelize, type ) => {
    return sequelize.define('modulo', {
        id_modulo: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_modulo: {
            type: type.STRING(100),
            allowNull: true,
            defaultValue: null
        },
        cliente: {
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
        tipologia: {
            type: type.STRING(20)
        },
        ancho: {
            type: type.DOUBLE,
            isNumeric: true
        },
        largo: {
            type: type.DOUBLE,
            isNumeric: true
        },
        material_cerramiento: {
            type: type.STRING(20)
        },
        col_exterior: {
            type: type.STRING(20)
        },
        col_interior: {
            type: type.STRING(20)
        },
        material_piso: {
            type: type.STRING(20)
        },
        puertas: {
            type: type.DOUBLE,
            isNumeric: true
        },
        ventanas: {
            type: type.DOUBLE,
            isNumeric: true
        },
        vent_alto: {
            type: type.DOUBLE,
            isNumeric: true
        },
        vent_ancho: {
            type: type.DOUBLE,
            isNumeric: true
        },
        equipamiento: {
            type: type.STRING(200)
        },
        inst_electrica: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        inst_sanitaria: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        inst_especiales: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        descripcion: {
            type: type.STRING(500),
            defaultValue: null
        },
        token_modulo: {
            type: type.STRING(3000)
        },
        url_qr: {
            type: type.STRING(3000)
        }
    });
}