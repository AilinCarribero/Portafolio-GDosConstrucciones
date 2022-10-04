const { Modulo, Alquiler } = require('../../db');

const findAllModulos = {
    include: [{
        model: Alquiler
    }],
    order: [['estado', 'ASC'], [Alquiler, 'fecha_h_alquiler', 'ASC']]
}

//Insertar un modulo nuevo
exports.insertModulo = (req, res) => {
    req.body.fecha_venta = !req.body.fecha_venta ? (req.body.venta ? new Date().toISOString().slice(0, 10) : null) : req.body.fecha_venta;
    req.body.venta = !req.body.venta ? 0 : req.body.venta;
    req.body.fecha_creacion = !req.body.fecha_creacion ? new Date().toISOString().slice(0, 10) : req.body.fecha_creacion;
    /*  0 => Libre / 1 => Alquilado / 2 => Vendido */
    req.body.estado = !req.body.estado ? 0 : req.body.estado;

    try {
        Modulo.create(req.body).then(response => {
            Modulo.findAll(findAllModulos).then(response => {
                response.statusText = "Ok";
                response.status = 200;
                res.json(response);
            }).catch(err => {
                err.todoMal = "Error al buscar los módulos";
                console.error(err);
                res.json(err);
                throw err;
            });
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

    try {
        //Cambiamos el estado del modulo a vendido
        Modulo.update({
            estado: 2,
            venta: req.body.venta,
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
}

exports.updateModulo = (req, res) => {
    const id = req.params.id.toString().replace(/\%20/g, ' ');
    const data = req.body;

    data.estado = !data.estado ? 0 : data.estado;

    try {
        //Cambiamos el estado del modulo a vendido
        Modulo.update(data, {
            where: {
                id_modulo: id
            }
        }).then(response => {
            console.log(response)
            Modulo.findAll(findAllModulos).then(response => {
                res.json(response);
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
}

exports.getCantModulos = (req, res) => {
    try {
        Modulo.findAll({
            include: [{
                model: Alquiler
            }],
            order: [['estado', 'ASC'], [Alquiler, 'fecha_h_alquiler', 'ASC']]
        }).then(response => {
            let auxDisponibles = 0;
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
                }
            });

            const cantModulos = {
                total: response.length,
                disponibles: auxDisponibles,
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