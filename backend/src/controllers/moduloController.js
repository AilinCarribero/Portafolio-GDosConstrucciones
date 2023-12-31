const { Modulo, Alquiler, ModuloDoble } = require('../../db');
const jwt = require('jsonwebtoken');

const findAllModulos = {
    include: [{
        model: Alquiler
    }, {
        model: ModuloDoble
    }
    ],
    order: [['estado', 'ASC'], [Alquiler, 'fecha_h_alquiler', 'ASC']]
}

//Insertar un modulo nuevo
exports.insertModulo = (req, res) => {
    req.body.fecha_venta = !req.body.fecha_venta ? (req.body.venta ? new Date().toISOString().slice(0, 10) : null) : req.body.fecha_venta;
    req.body.venta = !req.body.venta ? 0 : req.body.venta;
    req.body.fecha_creacion = !req.body.fecha_creacion ? new Date().toISOString().slice(0, 10) : req.body.fecha_creacion;
    req.body.nombre_modulo = !req.body.nombre_modulo ? null : req.body.nombre_modulo;
    req.body.ventanas = !req.body.ventanas ? 0 : req.body.ventanas;
    req.body.puertas = !req.body.puertas ? 0 : req.body.puertas;
    /*  0 => Libre / 1 => Alquilado / 2 => Vendido / 3 => En espera  */
    req.body.estado = !req.body.estado ? 0 : req.body.estado;

    req.body.equipamiento = req.body.equipamiento ? req.body.equipamiento.toString() : '';
    req.body.vent_alto = req.body.vent_alto ? req.body.vent_alto.join('-') : '';
    req.body.vent_ancho = req.body.vent_ancho ? req.body.vent_ancho.join('-') : '';

    try {
        Modulo.create(req.body).then(response => {
            const tokenId = jwt.sign(response.id_modulo, process.env.JWT_SECRET); //Este es para la url
            const tokenModulo = jwt.sign(response.dataValues, process.env.JWT_SECRET); //Este es modificable y contiene la informacion del modulo

            const url_qr = `https://cuerre.gdosconstrucciones.com.ar/${tokenId}`

            Modulo.update({ token_modulo: tokenModulo, url_qr: url_qr }, {
                where: {
                    id_modulo: response.id_modulo
                }
            }).then(response => {
                Modulo.findAll(findAllModulos).then(response => {
                    res.json({ data: response, url_qr: url_qr });
                }).catch(err => {
                    err.todoMal = "Error al buscar los módulos";
                    console.error(err);
                    res.json(err);
                    throw err;
                });
            }).catch(err => {
                err.todoMal = "Error al guardar la URL para el QR del módulo";
                console.error(err)
                return res.json(err)
            })
        }).catch(err => {
            err.todoMal = "Error al ingresar el módulo";
            console.error(err)
            return res.json(err)
        })
    } catch (error) {
        error.todoMal = "Error inesperado al ingresar el módulo";
        return res.json(error);
    }
}

//listar todos los modulos existentes
exports.listModulos = (req, res) => {
    try {
        Modulo.findAll(findAllModulos).then(response => {
            res.json(response);
        }).catch(error => {
            console.error(error)
            res.json(error);
        });
    } catch (error) {
        return res.json(error);
    }
}

exports.changeVendido = (req, res) => {
    const id = req.params.id.toString().replace(/\%20/g, ' ');

    const tokenId = jwt.sign(id, process.env.JWT_SECRET);

    Modulo.findOne({
        include: [{
            model: Alquiler
        }],
        where: {
            id_modulo: id
        },
        raw: true
    }).then(response => {
        let url_qr = '';

        if (!response.url_qr) {
            url_qr = `https://cuerre.gdosconstrucciones.com.ar/${tokenId}`;
        } else {
            url_qr = response.url_qr
        }

        response.token_modulo = '';

        const tokenModulo = jwt.sign(response, process.env.JWT_SECRET);

        try {
            //Cambiamos el estado del modulo a vendido
            Modulo.update({
                estado: 2,
                venta: req.body.venta,
                token_modulo: tokenModulo,
                cliente: req.body.cliente,
                url_qr: url_qr,
                fecha_venta: new Date().toISOString().slice(0, 10)
            }, {
                where: {
                    id_modulo: id
                }
            }).then(response => {
                Modulo.findAll(findAllModulos).then(response => {
                    res.json(response);
                }).catch(error => {
                    console.error(error)
                    res.json(error);
                });
            }).catch(err => {
                err.todoMal = "Error al actualizar el estado del módulo";
                console.error(err)
                res.json(err);
            })
        } catch (error) {
            error.todoMal = "Error inesperado al actualizar el estado del módulo";
            return res.json(error);
        }
    }).catch(err => {
        console.error(err)
    });
}

exports.updateModulo = (req, res) => {
    const id = req.params.id.toString().replace(/\%20/g, ' ');
    const data = req.body;

    data.estado = !data.estado ? 0 : data.estado;
    data.fecha_venta = !data.fecha_venta ? (data.venta ? new Date().toISOString().slice(0, 10) : null) : data.fecha_venta;

    data.equipamiento = !data.equipamiento ? '' : data.equipamiento.toString();
    data.vent_alto = !data.vent_alto ? '' : data.vent_alto.join('-');
    data.vent_ancho = !data.vent_ancho ? '' : data.vent_ancho.join('-');

    data.nombre_modulo = null;

    const tokenId = jwt.sign(id, process.env.JWT_SECRET);

    Modulo.findOne({
        include: [{
            model: Alquiler
        }, {
            model: ModuloDoble
        }],
        where: {
            id_modulo: id
        }
    }).then(response => {
        if (!response.url_qr) {
            data.url_qr = `https://cuerre.gdosconstrucciones.com.ar/${tokenId}`;
        } else {
            data.url_qr = response.url_qr
        }

        data.token_modulo = jwt.sign(data, process.env.JWT_SECRET);

        try {
            //Cambiamos el estado del modulo a vendido
            Modulo.update(data, {
                where: {
                    id_modulo: id
                }
            }).then(response => {
                Modulo.findAll(findAllModulos).then(response => {
                    res.json({ data: response, url_qr: data.url_qr });
                }).catch(error => {
                    console.error(error)
                    res.json(error);
                });
            }).catch(err => {
                err.todoMal = "Error al actualizar el módulo";
                console.error(err)
                res.json(err);
            })
        } catch (error) {
            error.todoMal = "Error inesperado al actualizar el módulo";
            return res.json(error);
        }
    }).catch(err => {
        console.error(err)
    });
}

exports.getCantModulos = (req, res) => {
    try {
        Modulo.findAll(findAllModulos).then(response => {
            let auxDisponibles = 0;
            let auxEnEspera = 0;
            let auxOcupados = 0;
            let auxVendidos = 0;

            response.forEach(modulo => {
                switch (modulo.estado) {
                    case 0:
                        auxDisponibles += 1;
                        break;
                    case 1:
                        auxOcupados += 1;
                        break;
                    case 2:
                        auxVendidos += 1;
                        break;
                    case 3:
                        auxEnEspera += 1;
                        break;
                }
            });

            const cantModulos = {
                total: response.length,
                disponibles: auxDisponibles,
                en_espera: auxEnEspera,
                ocupados: auxOcupados,
                vendidos: auxVendidos
            }

            res.json(cantModulos)
        }).catch(error => {
            console.error(error)
            res.json(error);
        });
    } catch (error) {
        return res.json(error);
    }
}

exports.getModulosToken = (req, res) => {
    const token = req.params.token;

    const id = jwt.verify(token, process.env.JWT_SECRET);

    Modulo.findOne({
        where: {
            id_modulo: id
        }
    }).then(response => {
        res.json(response.token_modulo);
    }).catch(err => {
        console.error(err);
        err.todoMal = "Error inesperado al encontrar el módulo";
        return res.json(err);
    });
}

exports.deleteModuloId = (req, res) => {
    const id = req.params.id.toString().replace(/\%20/g, ' ');

    Modulo.destroy({
        where: {
            id_modulo: id
        },
        include: [{
            model: Alquiler
        },
        {
            model: ModuloDoble
        }
        ],
    }).then(response => {
        Modulo.findAll(findAllModulos).then(response => {
            response.statusText = "Ok";
            response.status = 200;

            res.json(response);
        }).catch(err => {
            err.todoMal = "Error al actualizar el módulo";
            console.error(err);
            res.json(err);
            throw err;
        });
    }).catch(error => {
        err.todoMal = "Error al eliminar el módulo";
        console.error(error);
        res.json(error);
        throw error;
    });
}

exports.newModuloDoble = (req, res) => {
    const data = req.body;

    data.vinculacion = true;

    ModuloDoble.create(data).then(response => {
        //Editar el estado de vinculacion en los modulos
        //Modulo 1
        Modulo.update({ vinculado: true }, {
            where: {
                id_modulo: data.id_modulo_uno
            }
        }).then(response => {
            //Modulo 2
            Modulo.update({ vinculado: true }, {
                where: {
                    id_modulo: data.id_modulo_dos
                }
            }).then(response => {
                //Busqueda de modulos
                Modulo.findAll(findAllModulos).then(response => {
                    res.json({ data: response });
                }).catch(error => {
                    err.todoMal = "Error al buscar los módulos";
                    console.error(error)
                    res.json(error);
                });
            }).catch(err => {
                err.todoMal = "Error al cambiar el estado de vinculación del módulo";
                console.error(err)
                return res.json(err)
            })
        }).catch(err => {
            err.todoMal = "Error al cambiar el estado de vinculación del módulo";
            console.error(err)
            return res.json(err)
        })
    }).catch(err => {
        err.todoMal = "Error al ingresar el módulo";
        console.error(err)
        return res.json(err)
    })
}

exports.getModulosDobles = (req, res) => {
    ModuloDoble.findAll({
        include: [{
            model: Alquiler
        }, {
            model: Modulo,
            as: 'moduloUno',
            include: [{
                model: Alquiler
            },
            ]
        }, {
            model: Modulo,
            as: 'moduloDos',
            include: [{
                model: Alquiler
            },
            ]
        }],
        order: [['vinculacion', 'ASC']]
    }).then(response => {
        res.json(response);
    }).catch(err => {
        err.todoMal = "Error al buscar los módulos dobles";
        console.error(err);
        res.json(err);
        throw err;
    });
}