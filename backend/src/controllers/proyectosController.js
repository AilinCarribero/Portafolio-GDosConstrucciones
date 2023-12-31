const { CentroCosto, UnidadNegocio, Alquiler, Proyecto, Modulo, Egreso, Ingreso, ModuloDoble, IngresoAlquiler, Cliente } = require('../../db');
const { formatStringToNumber } = require('../utils/numbers');
const Decimal = require('decimal.js-light');
const moment = require('moment');

const configFindAllProyectos = {
    include: [{
        model: Alquiler,
        include: [{
            model: Modulo
        }, {
            model: IngresoAlquiler
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
        }]
    }],
    order: [['id_estado', 'ASC'], ['fecha_f_proyecto', 'ASC'], [Alquiler, 'fecha_d_alquiler', 'ASC']]
}

//listar todos los proyectos existentes
exports.listProyectos = (req, res) => {
    Proyecto.findAll({
        include: [{
            model: Alquiler,
            include: [{
                model: Modulo
            }, {
                model: IngresoAlquiler
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
            }]
        }],
        order: [['id_estado', 'ASC'], ['fecha_f_proyecto', 'ASC'], [Alquiler, 'fecha_h_alquiler', 'DESC']]
    }).then(response => {
        res.json(response);
    }).catch(error => {
        res.json(error);
    });
}

//Insertar un proyecto nuevo
exports.insertProyecto = async (req, res) => {
    let id_proyecto = '';
    const countAlquileres = req.body.alquileres ? (req.body.alquileres).length : '';

    req.body.costo = !req.body.costo ? 0 : formatStringToNumber(req.body.costo);
    req.body.venta = !req.body.venta ? 0 : formatStringToNumber(req.body.venta);
    req.body.alquiler_total = !req.body.alquiler_total ? 0 : formatStringToNumber(req.body.alquiler_total);
    req.body.fecha_f_proyecto = !req.body.fecha_f_proyecto ? null : req.body.fecha_f_proyecto;

    //Definimos el estado del proyecto
    if (!req.body.fecha_f_proyecto) {
        if (new Date(req.body.fecha_i_proyecto) > new Date()) {
            req.body.id_estado = 1;
        } else if (new Date(req.body.fecha_i_proyecto) < new Date()) {
            req.body.id_estado = 2;
        }
    } else {
        if (new Date(req.body.fecha_f_proyecto) < new Date()) {
            req.body.id_estado = 3;
        } else if (new Date(req.body.fecha_i_proyecto) < new Date() && new Date(req.body.fecha_f_proyecto) > new Date()) {
            req.body.id_estado = 2;
        }
    }

    try {
        const centro_costo = req.body.id_centro_costo ? await CentroCosto.findAll({
            where: {
                id_centro_costo: req.body.id_centro_costo
            },
            raw: true
        }) : '';

        const unidad_negocio = req.body.id_unidad_negocio ? await UnidadNegocio.findAll({
            where: {
                id_unidad_negocio: req.body.id_unidad_negocio
            },
            raw: true
        }) : '';

        let cliente = [];
        //Armamos el id de proyecto
        if (centro_costo[0].siglas_cc) {
            id_proyecto = centro_costo[0].siglas_cc;

            if (unidad_negocio[0].siglas_uc) {
                id_proyecto = id_proyecto + '-' + unidad_negocio[0].siglas_uc;

                if (req.body.cliente) {
                    id_proyecto = id_proyecto + '-' + req.body.cliente;
                    cliente = await Cliente.findOne({
                        where: {
                            nombre: req.body.cliente
                        },
                        raw: true
                    });

                    req.body.id_cliente = cliente.id_cliente;
                } else if (req.body.id_cliente) {
                    cliente = await Cliente.findOne({
                        where: {
                            id_cliente: req.body.id_cliente
                        },
                        raw: true
                    });

                    id_proyecto = id_proyecto + '-' + cliente.nombre;
                }
            }
        } else {
            return res.json('No se encontro el centro de costos');
        }

        req.body.id_proyecto = id_proyecto.trim();

        Proyecto.create(req.body).then(result => {
            req.body.alquileres ?
                req.body.alquileres.forEach((alquiler, i) => {
                    alquiler.id_proyecto = id_proyecto.trim();
                    //Una vez guardado el proyecto guardamos los alquileres relacionados con el proyecto
                    Alquiler.create(alquiler).then(result => {
                        /*Si el alquiler se guardo como corresponde el estado del modulo correspondiente al alquiler pasa a tener 
                        un estado de ocupado*/
                        if (alquiler.id_modulo) {
                            Modulo.update({ estado: alquiler.fecha_d_alquiler < new Date() ? 1 : 3, ubicacion: alquiler.ubicacion }, {
                                where: {
                                    id_modulo: alquiler.id_modulo
                                }
                            }).then(result => {
                                /*Si hasta aqui no hay errores se fija si es el ultimo alquiler que se guardo. De ser asi responde que todo
                                esta bien */
                                if (i == (countAlquileres - 1)) {
                                    Proyecto.findAll(configFindAllProyectos).then(response => {
                                        res.json(response);
                                    }).catch(error => {
                                        res.json(error);
                                    });
                                }
                            }).catch(error => {
                                console.error(error);
                                return res.json(error);
                            });
                        } else if (alquiler.id_modulo_doble) {
                            ModuloDoble.findOne({
                                where: {
                                    id_modulo_doble: alquiler.id_modulo_doble
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
                                raw: true
                            }).then(modulo_doble => {
                                ModuloDoble.update({ estado: new Date(alquiler.fecha_d_alquiler) < new Date() ? 1 : 3 }, {
                                    where: {
                                        id_modulo_doble: modulo_doble.id_modulo_doble
                                    }
                                }).then(response => { }).catch(err => {
                                    err.todoMal = "Error al actualizar el estado del módulo doble";
                                    console.error(err)
                                });

                                /*Si hasta aqui no hay errores debe actualizar los estados de los modulos de la oficina doble*/
                                Modulo.update({ estado: new Date(alquiler.fecha_d_alquiler) < new Date() ? 1 : 3, ubicacion: alquiler.ubicacion }, {
                                    where: {
                                        id_modulo: modulo_doble.id_modulo_uno
                                    }
                                }).then(result => {
                                    Modulo.update({ estado: new Date(alquiler.fecha_d_alquiler) < new Date() ? 1 : 3, ubicacion: alquiler.ubicacion }, {
                                        where: {
                                            id_modulo: modulo_doble.id_modulo_dos
                                        }
                                    }).then(result => {
                                        /*Si hasta aqui no hay errores se fija si es el ultimo alquiler que se guardo. De ser asi responde que todo esta bien */
                                        if (i == (countAlquileres - 1)) {
                                            Proyecto.findAll(configFindAllProyectos).then(response => {
                                                res.json(response);
                                            }).catch(error => {
                                                res.json(error);
                                            });
                                        }
                                    }).catch(error => {
                                        console.error(error);
                                        return res.json(error);
                                    });
                                }).catch(error => {
                                    console.error(error);
                                    return res.json(error);
                                });
                            }).catch(error => {
                                console.error(error);
                                return res.json(error);
                            });
                        }
                    }).catch(error => {
                        console.error(error);
                        return res.json(error);
                    });
                })
                : Proyecto.findAll(configFindAllProyectos).then(response => {
                    res.json(response);
                }).catch(error => {
                    res.json(error);
                });
        }).catch(error => {
            console.error(error);
            return res.json(error);
        });
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}

//Modificar proyecto
exports.updateProyecto = async (req, res) => {
    const proyecto = req.body;

    proyecto.costo = !proyecto.costo ? 0 : formatStringToNumber(proyecto.costo);
    proyecto.venta = !proyecto.venta ? 0 : formatStringToNumber(proyecto.venta);
    proyecto.alquiler_total = !proyecto.alquiler_total ? 0 : formatStringToNumber(proyecto.alquiler_total);
    proyecto.fecha_f_proyecto = !proyecto.fecha_f_proyecto ? null : proyecto.fecha_f_proyecto;

    Proyecto.update(proyecto, {
        where: {
            id_proyecto: proyecto.id_proyecto
        }
    }).then(response => {
        Proyecto.findAll(configFindAllProyectos).then(response => {
            response.statusText = "Ok";
            response.status = 200;

            res.json(response);
        }).catch(err => {
            err.todoMal = "Error al actualizar el proyecto";
            console.error(err);
            res.json(err);
            throw err;
        });
    }).catch(err => {
        err.todoMal = "Error al actualizar el proyecto";
        console.error(err);
        res.json(err);
        throw err;
    })
}

//Eliminar proyecto
exports.deleteProyecto = async (req, res) => {
    const idProyecto = req.params.id.toString().replace(/\%20/g, ' ');

    Proyecto.destroy({
        where: {
            id_proyecto: idProyecto
        },
        include: [{
            model: Alquiler,
            include: [{
                model: Modulo
            }, {
                model: IngresoAlquiler
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
            }]
        }]
    }).then(response => {
        res.json(response);
    }).catch(error => {
        res.json(error);
    });
}
