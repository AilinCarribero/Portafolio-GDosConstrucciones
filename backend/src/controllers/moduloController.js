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
    req.body.estado = !req.body.estado ? (req.body.venta ? 2 : 0) : req.body.estado;

    try {
        Modulo.create(req.body).then(response => {
            Modulo.findAll(findAllModulos).then(response => {
                response.statusText = "Ok";
                response.status = 200;
                res.json(response);
            }).catch(err => {
                err.todoMal = "Error al guardar el modulo";
                console.error(err);
                res.json(err);
                throw err;
            });
        }).catch(err => {
            console.error(err)  
            return res.json(err)
        })
    } catch (error) {
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
            console.error(err)
            res.json(err);
        })
    } catch (error) {
        return res.json(error);
    }
}