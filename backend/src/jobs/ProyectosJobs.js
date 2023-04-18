const { default: Decimal } = require("decimal.js-light");
const { Proyecto, Alquiler, Egreso, Modulo, Ingreso } = require("../../db");
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
    order: [['fecha_f_proyecto', 'DESC'], [Alquiler, 'fecha_h_alquiler', 'DESC']]
}

/*Estados: 1.Por Empezar 2.En proceso 3.Finalizado */

exports.estadoProyectos = () => {
    Proyecto.findAll(
        configFindAllProyectos
    ).then(response => {
        response.map(proyecto => {
            //Si existen alquileres
            if (proyecto.alquilers.length > 0) {
                let total_alquileres = new Decimal(0);

                proyecto.alquilers.map(alquiler => {
                    total_alquileres = total_alquileres.add(alquiler.valor);

                    if (proyecto.fecha_f_proyecto && (new Date(alquiler.fecha_h_alquiler) > new Date(proyecto.fecha_f_proyecto))) {

                        if (new Date(alquiler.fecha_h_alquiler) >= new Date() && new Date(alquiler.fecha_h_alquiler) >= new Date()) {

                            if (proyecto.id_estado != 2) {
                                Proyecto.update({ id_estado: 2, fecha_f_proyecto: alquiler.fecha_h_alquiler }, {
                                    where: {
                                        id_proyecto: proyecto.id_proyecto
                                    }
                                }).then(response => {
                                    console.log(proyecto.id_proyecto + ' Estado actualizado a "En proceso" y fecha final actualizada a la fecha de finalizacion del alquiler mas distante')
                                }).catch(err => {
                                    console.error(err);
                                })
                            }
                        }

                        if (new Date(alquiler.fecha_h_alquiler) < new Date()) {

                            if (proyecto.id_estado != 3) {
                                Proyecto.update({ id_estado: 3, fecha_f_proyecto: alquiler.fecha_h_alquiler }, {
                                    where: {
                                        id_proyecto: proyecto.id_proyecto
                                    }
                                }).then(response => {
                                    console.log(proyecto.id_proyecto + ' Estado actualizado a "Finalizado" y fecha final actualizada a la fecha de finalizacion del alquiler mas distante')
                                }).catch(err => {
                                    console.error(err);
                                })
                            }
                        }
                    }

                    //Nos aseguramos que la fecha de finalizacion de un proyecto este actualizada con respecto a la ultima fecha de finalizacion de un alquiler
                    if (!proyecto.fecha_f_proyecto || new Date(alquiler.fecha_h_alquiler) > new Date(proyecto.fecha_f_proyecto)) {
                        Proyecto.update({ fecha_f_proyecto: alquiler.fecha_h_alquiler }, {
                            where: {
                                id_proyecto: proyecto.id_proyecto
                            }
                        }).then(response => {
                            console.log(proyecto.id_proyecto + ' Fecha final actualizada a la fecha de finalizacion del alquiler mas distante')
                        }).catch(err => {
                            console.error(err);
                        })

                        if (new Date(alquiler.fecha_h_alquiler) >= new Date() && alquiler.fecha_d_alquiler <= new Date()) {

                            if (proyecto.id_estado != 2) {
                                Proyecto.update({ id_estado: 2 }, {
                                    where: {
                                        id_proyecto: proyecto.id_proyecto
                                    }
                                }).then(response => {
                                    console.log(proyecto.id_proyecto + ' Estado actualizado a "En proceso" y fecha final actualizada a la fecha de finalizacion del alquiler mas distante')
                                }).catch(err => {
                                    console.error(err);
                                })
                            }
                        }

                        if (new Date(alquiler.fecha_h_alquiler) < new Date()) {

                            if (proyecto.id_estado != 3) {
                                Proyecto.update({ id_estado: 3 }, {
                                    where: {
                                        id_proyecto: proyecto.id_proyecto
                                    }
                                }).then(response => {
                                    console.log(proyecto.id_proyecto + ' Estado actualizado a "Finalizado" y fecha final actualizada a la fecha de finalizacion del alquiler mas distante')
                                }).catch(err => {
                                    console.error(err);
                                })
                            }
                        }
                    }
                });

                //Nos aseguramos de que las fechas de finalizacion de los proyectos no sean diferenetes a las fechas del ultimos alquiler a vencer
                if (moment(proyecto.fecha_f_proyecto).format("DD-MM-YYYY") !== moment(proyecto.alquilers[0].fecha_h_alquiler).format("DD-MM-YYYY")) {
                    Proyecto.update({ fecha_f_proyecto: proyecto.alquilers[0].fecha_h_alquiler }, {
                        where: {
                            id_proyecto: proyecto.id_proyecto
                        }
                    }).then(response => {
                        console.log(proyecto.id_proyecto + ` Fecha final ${moment(proyecto.fecha_f_proyecto).format("DD-MM-YYYY")} actualizada a la fecha ${moment(proyecto.alquilers[0].fecha_h_alquiler).format("DD-MM-YYYY")} del alquiler mas distante`)
                    }).catch(err => {
                        console.error(err);
                    })
                }

                //Nos aseguramos de que el total de alquileres este bien calculado
                if (total_alquileres != proyecto.alquiler_total) {
                    Proyecto.update({ alquiler_total: total_alquileres.toNumber() }, {
                        where: {
                            id_proyecto: proyecto.id_proyecto
                        }
                    }).then(response => {
                        console.log(proyecto.id_proyecto + 'Se modifico el alquiler total')
                    }).catch(err => {
                        console.error(err);
                    });
                }
            } else {
                //Si existe una fecha de inicio y la fecha de inicio es menor a la actual...
                if (proyecto.fecha_i_proyecto && proyecto.fecha_i_proyecto <= new Date()) {
                    //Si existe una fecha de finalizacion y la fecha de finalizacion es mayor a la actual...
                    if (proyecto.fecha_f_proyecto && new Date(proyecto.fecha_f_proyecto) > new Date()) {
                        //Si el estado es diferente a 2 entonces lo cambia a iniciado
                        if (proyecto.id_estado != 2) {
                            Proyecto.update({ id_estado: 2 }, {
                                where: {
                                    id_proyecto: proyecto.id_proyecto
                                }
                            }).then(response => {
                                console.log('Estado del proyecto actualizado a "En proceso"')
                            }).catch(err => {
                                console.error(err);
                            })
                        }
                    }

                    //Si existe una fecha de finalizacion y la fecha de finalizacion es menor a la actual...
                    if (proyecto.fecha_f_proyecto && new Date(proyecto.fecha_f_proyecto) <= new Date()) {
                        //Si el estado es diferentes a 3 entonces lo cambia a finalizado
                        if (proyecto.id_estado != 3) {
                            Proyecto.update({ id_estado: 3 }, {
                                where: {
                                    id_proyecto: proyecto.id_proyecto
                                }
                            }).then(response => {
                                console.log('Estado del proyecto actualizado a "Finalizado"')
                            }).catch(err => {
                                console.error(err);
                            })
                        }
                    }
                }

                //Si existe una fecha de inicio y la fecha de inicio es mayor a la actual...
                if (proyecto.fecha_i_proyecto && proyecto.fecha_i_proyecto > new Date()) {
                    //Si el estado es diferentes a 1 entonces lo cambia a por empezar
                    if (proyecto.id_estado != 1) {
                        Proyecto.update({ id_estado: 1 }, {
                            where: {
                                id_proyecto: proyecto.id_proyecto
                            }
                        }).then(response => {
                            console.log('Estado actualizado a "Por empezar"')
                        }).catch(err => {
                            console.error(err);
                        })
                    }
                }
            }
        })
    }).catch(error => {
        console.error(error);
    });
}