module.exports = (sequelize, type) => {
    return sequelize.define('proyecto', {
        id_proyecto: {
            type: type.STRING(100),
            primaryKey: true
        },
        id_unidad_negocio: {
            type: type.INTEGER,
            isNumeric: true,
        },
        id_centro_costo: {
            type: type.INTEGER,
            isNumeric: true,
        },
        cliente: type.STRING(100),
        id_cliente: {
            type: type.INTEGER,
            isNumeric: true,
        },
        costo: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        venta: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        alquiler_total: {
            type: type.DOUBLE,
            defaultValue: 0
        },
        fecha_i_proyecto: {
            type: type.DATE,
            defaultValue: type.NOW
        },
        fecha_f_proyecto: {
            type: type.DATE,
            defaultValue: null
        },
        id_estado: {
            type: type.INTEGER,
            isNumeric: true
        }
    });
}

/* Insert new value so we can test the methods 
insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCC-PP-GDosConstrucciones","1","1",NULL,"0","0",NULL,NULL,"1"); 
insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCC-PP-GDosConstrucciones","2","1",NULL,"0","0",NULL,NULL,"1"); 
insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCC-PP-GDosConstrucciones","3","1",NULL,"0","0",NULL,NULL,"1"); 
*/