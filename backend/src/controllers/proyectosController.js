const { CentroCosto, UnidadNegocio, Alquiler, Proyecto, Modulo, Egreso, Ingreso } = require('../../db');
const { formatStringToNumber } = require('../utils/numbers');
const Decimal = require('decimal.js-light');
const moment = require('moment');

const configFindAllProyectos = {
    include: [{
        model: Alquiler,
        include: [{
            model: Modulo
        }]
    }, {
        model: Egreso
    }, {
        model: Ingreso
    }],
    order: [['id_estado', 'ASC'], ['fecha_f_proyecto', 'DESC'], [Alquiler, 'fecha_d_alquiler', 'ASC']]
}

const alquilerXMes = (alquileres) => {
    const alquilerTotalXMes = {
        enero: 0,
        febrero: 0,
        marzo: 0,
        abril: 0,
        mayo: 0,
        junio: 0,
        julio: 0,
        agosto: 0,
        setiembre: 0,
        octubre: 0,
        noviembre: 0,
        diciembre: 0,
    }

    alquileres.map(alquiler => {
        const fechaDesde = moment(alquiler.fecha_d_alquiler);
        const fechaHasta = moment(alquiler.fecha_h_alquiler);
        console.log(fechaDesde, fechaHasta)

        const cantMeses = Math.abs(fechaHasta.diff(fechaDesde, 'month'));
        const valorXMes = cantMeses ? new Decimal(alquiler.valor).div(cantMeses).toNumber() : alquiler.valor;
        console.log(alquiler.valor, '/', cantMeses, '=', valorXMes);

        for (let i = 0; i < cantMeses; i++) {
            console.log(fechaDesde.get('month'));
            switch (fechaDesde.get('month')) {
                case 0:
                    console.log('enero');
                    alquilerTotalXMes.enero += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 1:
                    console.log('febrero');
                    alquilerTotalXMes.febrero += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 2:
                    console.log('marzo');
                    alquilerTotalXMes.marzo += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 3:
                    console.log('abril');
                    alquilerTotalXMes.abril += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 4:
                    console.log('mayo');
                    alquilerTotalXMes.mayo += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 5:
                    console.log('junio');
                    alquilerTotalXMes.junio += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 6:
                    console.log('julio');
                    alquilerTotalXMes.julio += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 7:
                    console.log('agosto');
                    alquilerTotalXMes.agosto += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 8:
                    console.log('setiembre');
                    alquilerTotalXMes.setiembre += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 9:
                    console.log('octubre');
                    alquilerTotalXMes.octubre += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 10:
                    console.log('noviembre');
                    alquilerTotalXMes.noviembre += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
                case 11:
                    console.log('diciembre');
                    alquilerTotalXMes.diciembre += valorXMes;
                    fechaDesde.add(1, 'months').get('month');
                    console.log(fechaDesde.get('month'));
                    break;
            }
        }
    });

    return(alquilerTotalXMes)
}

//listar todos los proyectos existentes
exports.listProyectos = (req, res) => {
    Proyecto.findAll(
        configFindAllProyectos
    ).then(response => {
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

        if (centro_costo[0].siglas_cc) {
            id_proyecto = centro_costo[0].siglas_cc;

            if (unidad_negocio[0].siglas_uc) {
                id_proyecto = id_proyecto + '-' + unidad_negocio[0].siglas_uc;

                if (req.body.cliente) {
                    id_proyecto = id_proyecto + '-' + req.body.cliente
                }
            }
        } else {
            return res.json('No se encontro el centro de costos');
        }

        req.body.id_proyecto = id_proyecto;

        Proyecto.create(req.body).then(result => {
            req.body.alquileres ?
                req.body.alquileres.forEach((alquiler, i) => {
                    alquiler.id_proyecto = id_proyecto;

                    //Una vez guardado el proyecto guardamos los alquileres relacionados con el proyecto
                    Alquiler.create(alquiler).then(result => {
                        /*Si el alquiler se guardo como corresponde el estado del modulo correspondiente al alquiler pasa a tener 
                        un estado de ocupado*/
                        Modulo.update({ estado: 1 }, {
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
}
