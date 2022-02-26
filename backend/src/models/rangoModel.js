module.exports = ( sequelize, type ) => {
    return sequelize.define('rango', {
        id_rango: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rango: type.STRING(60)
    });
}