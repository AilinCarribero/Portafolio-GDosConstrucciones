const { Alquiler, Modulo } = require("../../db");

exports.estadoModulos = () => {
    Modulo.findAll({
        include: [{
            model: Alquiler
        }]
    }).then(response => {
        response.map(modulo => {
            if (modulo.estado != 2) {
                modulo.alquilers.map(alquiler => {
                    //Si la fecha esta entre la de inicio y la final
                    if (modulo.estado == 0 && alquiler.fecha_d_alquiler <= new Date() && alquiler.fecha_h_alquiler > new Date()) {
                        Modulo.update({ estado: 1 }, {
                            where: {
                                id_modulo: modulo.id_modulo
                            }
                        }).then(response => {
                            console.log('Estado del modulo actualizado a "En uso"');
                        }).catch(err => {
                            console.error(err)
                        })
                    }

                    //Si la fecha de finalizacion es menor a la actual
                    if(modulo.estado == 1 && alquiler.fecha_h_alquiler < new Date()) {
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
                })
            }
        })
    }).catch(error => {
        console.error(error);
    });
}