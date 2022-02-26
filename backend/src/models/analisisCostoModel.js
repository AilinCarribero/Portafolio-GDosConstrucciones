module.exports = ( sequelize, type ) => {
    return sequelize.define('analisis_costo', {
        id_analisis_costo: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        analisis_costo: type.STRING(60),
        requiere_detalle: {
            type: type.INTEGER,
            isNumeric: true
        },
        id_centro_costo: {
            type: type.INTEGER,
            isNumeric: true
        }
    });
}


/* Insert new value so we can test the methods 
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Material","0","2"); 
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Mano de obra","0","2"); 
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Otros-Inusual","1","2"); 
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Bienes de Uso","1","1"); 
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Gastos de Empresa","1","1"); 
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Acopio de Materiales","1","1"); 
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Sueldo', '1', '3');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Gasto Operativo', '1', '3');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Alquiler', '1', '3');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Otro', '1', '3');
*/
