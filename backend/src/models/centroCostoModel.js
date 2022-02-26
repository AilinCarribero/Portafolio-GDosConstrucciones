module.exports = ( sequelize, type ) => {
    return sequelize.define('centro_costo', {
        id_centro_costo: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo_centro_costo: type.STRING(60),
        siglas_cc: type.STRING(9)
    });
}


/* Insert new value so we can test the methods 
insert into centro_costo (tipo_centro_costo,siglas_cc) value ("Centro de Costo Común", "CCC"); /*id = 1
insert into centro_costo (tipo_centro_costo,siglas_cc) value ("Centro de Costo de Proyecto", "CCP"); /*id = 2
insert into centro_costo (tipo_centro_costo,siglas_cc) value ("Centro de Costo de Empresa", "CCE"); /*id = 3*/