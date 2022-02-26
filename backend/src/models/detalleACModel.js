module.exports = ( sequelize, type ) => {
    return sequelize.define('detalle_analisis_costo', {
        id_detalle_ac: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_analisis_costo: {
            type: type.INTEGER,
            isNumeric: true
        },
        detalle_ac: type.STRING(100)
    });
}


/* Insert new value so we can test the methods 
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("4","Vehículos"); /*id = 1
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("4","Maquinas-Equipos-Combustibles"); /*id = 2
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("4","Tecnologia"); /*id = 3
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Sueldos"); /*id = 4
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Alquileres"); /*id = 5
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Impuestos"); /*id = 6
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Mantenimieto de Cuentas"); /*id = 7
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Presentaciones - Licitaciones"); /*id = 8
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Insumos - Libreria - Otros"); /*id = 9
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("6","PP"); /*id = 10
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("6","D"); /*id = 11
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("6","M"); /*id = 12*/