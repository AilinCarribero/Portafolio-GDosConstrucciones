const { Alquiler, Modulo, Proyecto, ModuloDoble, IngresoAlquiler } = require("../../db");
const Decimal = require('decimal.js-light');

exports.insertAlquiler = (req, res) => {
    try {
        Alquiler.create(req.body)
            .then(response => {
                response.todoOk = "Ok";
                res.json(response);
            }).catch(error => {
                console.error(error);
                res.json(error);
            })
    } catch (error) {
        return res.json(error);
    }
}

exports.getAlquileres = (req, res) => {
    try {
        Alquiler.findAll({
            include: {
                model: [Modulo, Proyecto, ModuloDoble]
            }
        })
    } catch (error) {
        return res.json(error);
    }
}

//Listar alquileres por id de proyecto
exports.getAlquileresId = async (req, res) => {
    const idProyecto = req.params.id.toString().replace(/\%20/g, ' ');

    Alquiler.findAll({
        include: [{
            model: Modulo
        }, {
            model: Proyecto
        }, {
            model: ModuloDoble
        }, {
            model: IngresoAlquiler
        }],
        where: {
            id_proyecto: idProyecto
        }
    }).then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(error => {
        console.error(error);
        res.json(error);
    });
}

exports.updateNewRenovarContrato = async (req, res) => {
    const action = req.body.action;

    let total_alquileres = new Decimal(0);

    req.body.proyecto.alquilers.forEach(alquiler => {
        total_alquileres = new Decimal(alquiler.valor).add(total_alquileres);
    });

    const updateProyecto = {
        id_proyecto: req.body.id_proyecto,
        alquiler_total: total_alquileres.add(req.body.valor).toNumber(),
        fecha_f_proyecto: req.body.proyecto.fecha_f_proyecto ? (new Date(req.body.fecha_h_alquiler) >= new Date(req.body.proyecto.fecha_f_proyecto) ? new Date(req.body.fecha_h_alquiler).toISOString().slice(0, 10) : new Date(req.body.proyecto.fecha_f_proyecto).toISOString().slice(0, 10)) : null,
        id_estado: new Date(req.body.fecha_h_alquiler) >= new Date() ? 2 : 3
    }

    const newAlquiler = {
        id_modulo: req.body.id_modulo || null,
        id_modulo_doble: req.body.id_modulo_doble || null,
        id_proyecto: req.body.id_proyecto,
        valor: req.body.valor,
        fecha_d_alquiler: req.body.fecha_d_alquiler,
        fecha_h_alquiler: req.body.fecha_h_alquiler,
    }

    /*Si la fecha de inicio del aquiler es anterior a hoy entonces se debe actualizar el estado del modulo a alquilado, sino tiene que quedar en espera */
    /*  0 => Libre / 1 => Alquilado / 2 => Vendido / 3 => En espera */
    if (new Date(newAlquiler.fecha_d_alquiler) <= new Date()) {
        if (newAlquiler.id_modulo) {
            Modulo.update({ estado: 1, ubicacion: req.body.ubicacion }, {
                where: {
                    id_modulo: newAlquiler.id_modulo
                }
            }).then(response => { }).catch(err => {
                err.todoMal = "Error al actualizar el estado del módulo";
                console.error(err)
                res.json(err);
            });
        } else {
            ModuloDoble.update({ estado: 1 }, {
                where: {
                    id_modulo_doble: newAlquiler.id_modulo_doble
                }
            }).then(response => {
                ModuloDoble.findOne({
                    where: {
                        id_modulo_doble: newAlquiler.id_modulo_doble
                    },
                    include: [{
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
                }).then(response => {
                    Modulo.update({ estado: 1, ubicacion: req.body.ubicacion }, {
                        where: {
                            id_modulo: response.id_modulo_uno
                        }
                    }).then(response => { }).catch(err => {
                        err.todoMal = "Error al actualizar el estado del módulo";
                        console.error(err)
                        res.json(err);
                    });

                    Modulo.update({ estado: 1, ubicacion: req.body.ubicacion }, {
                        where: {
                            id_modulo: response.id_modulo_dos
                        }
                    }).then(response => { }).catch(err => {
                        err.todoMal = "Error al actualizar el estado del módulo";
                        console.error(err)
                        res.json(err);
                    });
                }).catch(err => {
                    console.error(err);
                    res.json(err);
                })
            }).catch(err => {
                err.todoMal = "Error al actualizar el estado del módulo doble";
                console.error(err)
            });
        }
    }

    Proyecto.update({ alquiler_total: updateProyecto.alquiler_total, fecha_f_proyecto: updateProyecto.fecha_f_proyecto, id_estado: updateProyecto.id_estado }, {
        where: {
            id_proyecto: updateProyecto.id_proyecto
        }
    }).then(response => {
        if (action === "Modificar") {
            Alquiler.update(newAlquiler, {
                where: {
                    id_alquiler: req.body.id_alquiler
                }
            }).then(response => {
                Alquiler.findAll({
                    include: [{
                        model: Modulo
                    }, {
                        model: Proyecto
                    }, {
                        model: ModuloDoble,
                        include: [{
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
                    }],
                    where: {
                        id_proyecto: updateProyecto.id_proyecto
                    }
                }).then(response => {
                    response.statusText = "Ok";
                    response.status = 200;
                    res.json(response);
                }).catch(error => {
                    err.todoMal = `Error al buscar los alquileres del proyecto ${updateProyecto.id_proyecto}`;
                    console.error(error);
                    res.json(error);
                });
            }).catch(err => {
                err.todoMal = `Error al modificar el alquiler del módulo ${req.body.nombre_modulo}`;
                console.error(err)
                res.json(err);
            })
        } else {
            Alquiler.create(newAlquiler).then(response => {
                Alquiler.findAll({
                    include: [{
                        model: Modulo
                    }, {
                        model: Proyecto
                    }, {
                        model: ModuloDoble
                    }],
                    where: {
                        id_proyecto: updateProyecto.id_proyecto
                    }
                }).then(response => {
                    response.statusText = "Ok";
                    response.status = 200;
                    res.json(response);
                }).catch(error => {
                    err.todoMal = `Error al buscar los alquileres del proyecto ${updateProyecto.id_proyecto}`;
                    console.error(error);
                    res.json(error);
                });
            }).catch(err => {
                err.todoMal = `Error al ingresar el nuevo alquiler del módulo ${req.body.nombre_modulo}`;
                console.error(err)
                res.json(err);
            })
        }
    }).catch(err => {
        err.todoMal = "Error al actualizar el valor total del alquiler en el proyecto";
        console.error(err)
        res.json(err);
    })
}
