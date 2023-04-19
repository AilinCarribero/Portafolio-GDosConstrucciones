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
    //Modificamos fechas
    Proyecto.findAll(
        configFindAllProyectos
    ).then(proyectos => {
        proyectos.map(proyecto => {
            if (proyecto.alquilers.length > 0) {
                //Nos aseguramos de que las fechas de finalizacion de los proyectos no sean diferenetes a las fechas del ultimos alquiler a vencer
                if (!proyecto.fecha_f_proyecto || moment(proyecto.fecha_f_proyecto).format("DD-MM-YYYY") !== moment(proyecto.alquilers[0].fecha_h_alquiler).format("DD-MM-YYYY")) {
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
            }
        })
    }).catch(err => {
        console.error(err)
    });

    //Modificamos estados ya con las fechas actualizadas
    Proyecto.findAll({
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
        order: [['fecha_f_proyecto', 'DESC'], [Alquiler, 'fecha_h_alquiler', 'ASC']]
    }).then(response => {
        response.map(proyecto => {
            //Si existen alquileres

            if(moment(proyecto.fecha_f_proyecto).format('YYYY-MM-DD') >= moment(new Date()).format('YYYY-MM-DD')) {
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

            if (moment(proyecto.fecha_f_proyecto).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) {
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
        })
    }).catch(error => {
        console.error(error);
    });
}