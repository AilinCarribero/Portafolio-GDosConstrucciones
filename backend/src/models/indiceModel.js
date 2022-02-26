module.exports = ( sequelize, type ) => {
    return sequelize.define('indice', {
        id_indice: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_indice: type.STRING(100),
        valor: type.DOUBLE,
        tipo_valor: type.STRING(100),
        fecha_mod:{ 
            type: type.DATE,
            defaultValue: type.NOW
        },
    });
}