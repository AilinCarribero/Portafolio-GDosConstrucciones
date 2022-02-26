module.exports = ( sequelize, type ) => {
    return sequelize.define('estado', {
        id_estado: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        estado: type.STRING(100),
    });
}


/* Insert new value so we can test the methods 
insert into estado (estado) value ("Por empezar"); /*id = 1
insert into estado (estado) value ("En proceso"); /*id = 2
insert into estado (estado) value ("Finalizado"); /*id = 3*/