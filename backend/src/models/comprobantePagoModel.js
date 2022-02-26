module.exports = ( sequelize, type ) => {
    return sequelize.define('comprobante_pago', {
        id_comprobante_pago: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo_comprobante: type.STRING(60),
        nombre_comprobante: type.STRING(60),
    });
}


/* Insert new value so we can test the methods 
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("A","Factura"); /*id = 1
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("B","Factura"); /*id = 2
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("C","Factura"); /*id = 3
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("Z","Factura"); /*id = 4
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("Z","Comprobante de Pago"); /*id = 5*/