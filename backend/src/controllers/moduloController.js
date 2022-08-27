const { Modulo, Alquiler } = require('../../db');

//Insertar un modulo nuevo
exports.insertModulo = (req, res) => {
    if (!req.body.fecha_venta) {
        req.body.fecha_venta = '1000-01-01';
    }
    
    req.body.venta = !req.body.venta ? 0 : formatStringToNumber(req.body.venta);
    
    if (!req.body.fecha_creacion) {
        req.body.fecha_creacion = new Date().toISOString().slice(0, 10);
    }
    if(!req.body.estado) {
        req.body.estado = 0;
        /*  0 => Libre
            1 => Alquilado
            3 => Vendido */
    }

    try {
        Modulo.create(req.body).then( response => {
            Modulo.findAll({
                include: [{
                    model: Alquiler
                }]
            }).then(response => {
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
        Modulo.findAll({
            include: [{
                model: Alquiler
            }],
            order: [['estado', 'ASC'], [Alquiler, 'fecha_h_alquiler', 'ASC']]
        }).then( response => {
            res.json(response);
        }).catch( error => {
            console.error(error)
            res.json(error);
        });
    } catch (error) {
        return res.json(error);
    }
}