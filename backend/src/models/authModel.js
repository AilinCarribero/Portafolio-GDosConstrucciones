module.exports = ( sequelize, type ) => {
    return sequelize.define('usuario', {
        id_user: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_apellido: type.STRING(60),
        usr_login: {
            type: type.STRING(60)
        },
        correo: {
            type: type.STRING(100),
            validator: {
                isEmail: true
            }
        },
        telefono: {
            type: type.STRING(35)
        },
        contrasegna: type.STRING(300),
        id_rango: {
            type: type.INTEGER,
            isNumeric: true
        }
    });
}

/* Insert new value so we can test the methods 
insert into usuario (nombre_apellido, correo, contrasegna, id_rango) value ("Ailin Carribero","ailin@carribero.com.ar","$2a$10$sL6ztMKeinZLP69DFz08Pu0XWR7/1dxF89zHjoskSkVKNj9vdw8Py","1");
insert into usuario (nombre_apellido, correo, contrasegna, id_rango) value ("Rodrigo User","prueba@user.com","$2a$10$sL6ztMKeinZLP69DFz08Pu0XWR7/1dxF89zHjoskSkVKNj9vdw8Py","2");
insert into usuario (nombre_apellido, correo, contrasegna, id_rango) value ("Rodrigo Admin","prueba@admin.com","$2a$10$sL6ztMKeinZLP69DFz08Pu0XWR7/1dxF89zHjoskSkVKNj9vdw8Py","1");
*/