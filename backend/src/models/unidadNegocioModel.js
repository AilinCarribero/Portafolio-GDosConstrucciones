module.exports = ( sequelize, type ) => {
    return sequelize.define('unidad_negocio', {
        id_unidad_negocio: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_centro_costo: {
            type: type.INTEGER,
            isNumeric: true
        },
        unidad_negocio: type.STRING(60),
        siglas_uc: type.STRING(9)
    });
}


/* Insert new value so we can test the methods 
insert into unidad_negocio (id_centro_costo,unidad_negocio,sigas_uc) value ("2","Público Privado","PP"); /*id = 1
insert into unidad_negocio (id_centro_costo,unidad_negocio,sigas_uc) value ("2","Desarrollos","D"); /*id = 2
insert into unidad_negocio (id_centro_costo,unidad_negocio,sigas_uc) value ("2","Módulos","M"); /*id = 3*/