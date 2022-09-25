const { Proyecto, Alquiler, Egreso, Modulo, Ingreso } = require("../../db");

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
            //Si existe una fecha de inicio y la fecha de inicio es menor a la actual...
            if (proyecto.fecha_i_proyecto && proyecto.fecha_i_proyecto <= new Date()) {
                //Si existe una fecha de finalizacion y la fecha de finalizacion es mayor a la actual...
                if (proyecto.fecha_f_proyecto && proyecto.fecha_f_proyecto > new Date()) {
                    //Si el estado es diferente a 2 entonces lo cambia a iniciado
                    if (proyecto.id_estado != 2) {
                        Proyecto.update({ id_estado: 2 }, {
                            where: {
                                id_proyecto: proyecto.id_proyecto
                            }
                        }).then(response => {
                            console.log('Estado del protecto actualizado a "En proceso"')
                        }).catch(err => {
                            console.error(err);
                        })
                    }
                }

                //Si existe una fecha de finalizacion y la fecha de finalizacion es menor a la actual...
                if (proyecto.fecha_f_proyecto && proyecto.fecha_f_proyecto <= new Date()) {
                    //Si el estado es diferentes a 3 entonces lo cambia a finalizado
                    if (proyecto.id_estado != 3) {
                        console.log(proyecto.id_proyecto);

                        Proyecto.update({ id_estado: 3 }, {
                            where: {
                                id_proyecto: proyecto.id_proyecto
                            }
                        }).then(response => {
                            console.log('Estado del protecto actualizado a "Finalizado"')
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
                    console.log(proyecto.id_proyecto)
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

            //Si existen alquileres
            if (proyecto.alquilers.length > 0) {

                proyecto.alquilers.map(alquiler => {
                    if (proyecto.fecha_f_proyecto && (alquiler.fecha_h_alquiler > proyecto.fecha_f_proyecto)) {

                        if (alquiler.fecha_h_alquiler >= new Date()) {
                            
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
                    }
                })
            }
        })
    }).catch(error => {
        console.error(error);
    });
}