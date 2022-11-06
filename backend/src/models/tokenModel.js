module.exports = ( sequelize, type ) => {
    return sequelize.define('token', {
        id_token: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uso: {
            type: type.STRING(30),
            allowNull: false,
        },
        token: {
            type: type.STRING(3000),
            allowNull: false,
        },
    });
}