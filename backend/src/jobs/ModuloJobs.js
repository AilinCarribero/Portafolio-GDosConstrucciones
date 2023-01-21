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

            /*  0 => Libre / 1 => Alquilado / 2 => Vendido / 3 => En espera  */
            if (modulo.estado != 2) {
                if (modulo.alquilers.length > 0) {
                    //Si la fecha esta entre la de inicio y la final
                    if (modulo.estado == 0 && modulo.alquilers[0].fecha_d_alquiler <= new Date() && modulo.alquilers[0].fecha_h_alquiler >= new Date()) {
                        Modulo.update({ estado: 1 }, {
                            where: {
                                id_modulo: modulo.id_modulo
                            }
                        }).then(response => {
                            console.log('Estado del modulo actualizado a "Alquilado"');
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
                    } else if (modulo.alquilers[0].fecha_d_alquiler > new Date()) {
                        /* Si la ultima fecha de inicio es mayor a la actual debe revisar el otro alquiler, si no existe entonces esta en "en espera", sino debe revisar si 
                        la fecha actual esta en este alquiler, sino revisar el siguiente */
                        for (let i = modulo.alquilers.length - 1; i >= 0; i--) {
                            if (modulo.alquilers[i].fecha_d_alquiler <= new Date() && modulo.alquilers[i].fecha_h_alquiler >= new Date()) {
                                if (modulo.estado != 1) {
                                    Modulo.update({ estado: 1 }, {
                                        where: {
                                            id_modulo: modulo.id_modulo
                                        }
                                    }).then(response => {
                                        console.log('Estado del modulo actualizado a "Alquilado"');
                                    }).catch(err => {
                                        console.error(err)
                                    });
                                }

                                break;
                            } else if (modulo.alquilers[i].fecha_d_alquiler > new Date()) {
                                if (modulo.estado != 3) {
                                    Modulo.update({ estado: 3}, {
                                        where: {
                                            id_modulo: modulo.id_modulo
                                        }
                                    }).then(response => {
                                        console.log('Estado del modulo actualizado a "En Espera"');
                                    }).catch(err => {
                                        console.error(err)
                                    });
                                }

                                break;
                            }
                        }
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