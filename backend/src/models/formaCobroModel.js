module.exports = ( sequelize, type ) => {
    return sequelize.define('forma_cobro', {
        id_forma_cobro: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        forma_cobro: type.STRING(100),
        requiere_f_cobro: {
            type: type.INTEGER,
            isNumeric: true
        },
        requiere_d_cobro: {
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
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Efectivo","0","0","2"); /*id = 1
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Transferecia - Debito","0","0","2"); /*id = 2
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Diferido","1","0","2"); /*id = 3
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Tarjeta de Credito","1","1","2"); /*id = 4
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Pendiente - Compromiso","1","0","2"); /*id = 5
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Otro - Inusual","1","1","2"); /*id = 6
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Inversiones Financieras","1","1","1"); /*id = 7
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Apalancamiento","1","1","1"); /*id = 8
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Credito Bancario","1","1","1"); /*id = 9
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("E-Cheq","1","1","2");
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("C.P.D.","1","1","2");
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Otro - Inusual","1","1","1"); /*id = 10*/
