const { Alquiler, Modulo } = require("../../db");

exports.estadoModulos = () => {
    Modulo.findAll({
        include: [{
            model: Alquiler
        }],
        order: [[Alquiler, 'fecha_h_alquiler', 'DESC']]
    }).then(response => {
        response.map(modulo => {
            /* Para que no se siga actualizando al pedo el estado se debe:
            - Leer el primer alquiler que llega
            - Analizar de acuerdo a los datos del primer alquiler que estado corresponde
            */
            if (modulo.estado != 2) {
                if (modulo.alquilers.length > 0) {
                    //Si la fecha esta entre la de inicio y la final
                        if (modulo.estado == 0 && modulo.alquilers[0].fecha_d_alquiler <= new Date() && modulo.alquilers[0].fecha_h_alquiler >= new Date()) {
                            Modulo.update({ estado: 1 }, {
                                where: {
                                    id_modulo: modulo.id_modulo
                                }
                            }).then(response => {
                                console.log('Estado del modulo actualizado a "En uso"');
                            }).catch(err => {
                                console.error(err)
                            })

                            //Si la fecha de finalizacion es menor a la actual
                        } else if (modulo.estado == 1 && modulo.alquilers[0].fecha_h_alquiler < new Date()) {
                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: modulo.id_modulo
                                }
                            }).then(response => {
                                console.log('Estado del modulo actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            })

                            //Si la fecha de inicio es mayor a la actual
                        } else if (modulo.estado == 1 && modulo.alquilers[0].fecha_d_alquiler > new Date()) {
                            Modulo.update({ estado: 0 }, {
                                where: {
                                    id_modulo: modulo.id_modulo
                                }
                            }).then(response => {
                                console.log('Estado del modulo actualizado a "Disponible"');
                            }).catch(err => {
                                console.error(err)
                            })
                        }
                } else {
                    if (modulo.estado == 1) {
                        Modulo.update({ estado: 0 }, {
                            where: {
                                id_modulo: modulo.id_modulo
                            }
                        }).then(response => {
                            console.log('Estado del modulo SIN ALQUILERES actualizado a "Disponible"');
                        }).catch(err => {
                            console.error(err)
                        })
                    }
                }
            }
        })
    }).catch(error => {
        console.error(error);
    });
}