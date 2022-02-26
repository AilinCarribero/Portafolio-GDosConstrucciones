module.exports = ( sequelize, type ) => {
    return sequelize.define('forma_pago', {
        id_forma_pago: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        forma_pago: type.STRING(100),
        requiere_f_pago: {
            type: type.INTEGER,
            isNumeric: true
        },
        requiere_d_pago: {
            type: type.INTEGER,
            isNumeric: true
        }
    });
}


/* Insert new value so we can test the methods 
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Efectivo","0","0"); /*id = 1
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Transferencia - Debito","0","0"); /*id = 2
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Diferido","1","0"); /*id = 3
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Tarjeta de Credito","1","1"); /*id = 4
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Cuenta Corriente","1","0"); /*id = 5
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Pendiente - Compromiso","1","0"); /*id = 6
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Otro - Inusual","1","1"); /*id = 7*/