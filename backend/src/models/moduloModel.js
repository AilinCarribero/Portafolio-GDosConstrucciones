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
            type: type.STRING(100),
            allowNull: true,
            defaultValue: null
        },
        costo: {
            type:type.DOUBLE,
            defaultValue: 0
        },
        costo_usd: {
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
            allowNull: true,
            defaultValue: 0,
            isNumeric: true
        },
        tipologia: {
            type: type.STRING(20),
            allowNull: true,
            defaultValue: null
        },
        ancho: {
            type: type.DOUBLE,
            allowNull: true,
            defaultValue: 0,
            isNumeric: true
        },
        largo: {
            type: type.DOUBLE,
            allowNull: true,
            defaultValue: 0,
            isNumeric: true
        },
        material_cerramiento: {
            type: type.STRING(20),
            allowNull: true,
            defaultValue: null
        },
        col_exterior: {
            type: type.STRING(20),
            allowNull: true,
            defaultValue: null
        },
        col_interior: {
            type: type.STRING(20),
            allowNull: true,
            defaultValue: null
        },
        material_piso: {
            type: type.STRING(20),
            allowNull: true,
            defaultValue: null
        },
        puertas: {
            type: type.DOUBLE,
            allowNull: true,
            defaultValue: 0,
            isNumeric: true
        },
        ventanas: {
            type: type.DOUBLE,
            allowNull: true,
            defaultValue: 0,
            isNumeric: true
        },
        vent_alto: {
            type: type.STRING(200),
            allowNull: true,
            defaultValue: 0,
        },
        vent_ancho: {
            type: type.STRING(200),
            allowNull: true,
            defaultValue: 0,
        },
        equipamiento: {
            type: type.STRING(200),
            allowNull: true,
            defaultValue: null
        },
        inst_electrica: {
            type: type.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        inst_sanitaria: {
            type: type.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        inst_especiales: {
            type: type.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        descripcion: {
            type: type.STRING(500),
            allowNull: true,
            defaultValue: null
        },
        token_modulo: {
            type: type.STRING(3000)
        },
        url_qr: {
            type: type.STRING(3000)
        },
        ubicacion: {
            type: type.STRING(3000)
        },
        vinculado: {
            type: type.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
    });
}