const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Base de Datos
const { Auth, Rango } = require('../../db');

//Busca los usuarios registrados
exports.getUser = async (req, res) => {
    try {
        await Auth.findAll({
            include: [{
                model: Rango
            }]
        }).then(response => {
            res.json(response);
        }).catch(error => {
            res.json(error);
        });

        res.end();
    } catch (error) {
        return res.json(error);
    }
}

//Login
exports.login = async (req, res) => {
    console.log("gola2")
    const usr_login = req.body.usr_login;
    const password = req.body.password;

    if (usr_login && password) {
        try {
            Auth.findAll({
                include: [{
                    model: Rango
                }],
                where: {
                    usr_login: usr_login
                },
                raw: true
            }).then(async response => {
                if (response && response.length > 0) {
                    if (await bcryptjs.compare(password, response[0].contrasegna)) {
                        const rango = response[0]['rango.rango'];
                        const id = response[0].id_user;
                        const nombre_apellido = response[0].nombre_apellido;

                        const token = jwt.sign({ id: id, rango: rango, nombre_apellido: nombre_apellido }, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_TIME_EXPIRED
                        });

                        res.json({
                            id: id,
                            rango: rango,
                            token: token,
                            nombre_apellido: nombre_apellido
                        });
                    } else {
                        res.json({...response, message: 'Contraseña incorrecta'});
                    }
                } else {
                    //res.send('El usuario no existe');
                    res.json({...response, message: 'El usuario no existe'});
                }
            }).catch(err => {
                console.error(err);
                //res.send('Hubo un error desconocido');
                res.json({...err, message: 'Hubo un error desconocido'});
            })
        } catch (error) {
            //res.send('Usuario incorrecto');
            console.error(error)
            res.json({...error, message: 'Usuario incorrecto'});
        }
    } else {
        res.json({message:'Por favor ingrese los datos solicitados'});
    }
}

//Agrega un nuevo usuario
exports.registrar = async (req, res) => {
    const user = req.body.nombre_apellido;
    const usr_login = req.body.usr_login.trim();
    const telefono = req.body.telefono;
    const password = req.body.contrasegna;
    const correo = req.body.correo;
    const rango = req.body.id_rango;

    let contrasegna = await bcryptjs.hash(password, 10);

    const data = {
        nombre_apellido: user,
        correo: correo,
        id_rango: rango,
        contrasegna: contrasegna,
        usr_login: usr_login,
        telefono: telefono
    }

    try {
        Auth.create(data).then(response => {
            response.todoOk = "Ok";
            res.json(response);
            res.end();
        }).catch(err => {
            console.error(err);
            res.json(err);
        })
    } catch (error) {
        res.json(error);
    }
    //let passwordHash = bcryptjs.hashSync(password , 10); //Encriptacion-> se pasa como parametro lo que se quiere encriptar y la cantidad de interaciones de encriptacion
    //let passwordHash = await bcryptjs.hash(password , 10);
}

exports.editUser = async (req, res) => {
    const data = req.body;
    const usr_login = req.body.usr_login.trim();

    let contrasegna = '';

    if (data.newContrasegna) {
        contrasegna = await bcryptjs.hash(data.newContrasegna, 10);
    } else {
        contrasegna = data.oldContrasegna;
    }

    Auth.update({ ...data, contrasegna: contrasegna, usr_login: usr_login }, {
        where: {
            id_user: data.id_user
        }
    }).then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(err => {
        console.error(err);
        res.json({ ...err, message: err.name === 'SequelizeUniqueConstraintError' ? 'Usuario de login duplicado' : 'No se pudo guardar el usuario' });
    })
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    Auth.destroy({
        where: {
            id_user: id
        },
    }).then(response => {
        Auth.findAll({
            include: [{
                model: Rango
            }]
        }).then(response => {
            response.statusText = "Ok";
            response.status = 200;

            res.json(response);
        }).catch(err => {
            err.todoMal = "Error al actualizar el usuario";
            console.error(err);
            res.json(err);
            throw err;
        });
    }).catch(error => {
        err.todoMal = "Error al eliminar el usuario";
        console.error(error);
        res.json(error);
        throw error;
    });
}