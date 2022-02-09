const bd = require('../../pool');
const sql = require('../sql/moduloQuery');

//Insertar un modulo nuevo
exports.insertModulo = async (req, res) => {
    if (!req.body.fecha_venta) {
        req.body.fecha_venta = '0000-00-00';
    }
    if (!req.body.venta) {
        req.body.venta = 0;
    }
    if (!req.body.fecha_creacion) {
        req.body.fecha_creacion = new Date().toISOString().slice(0, 10);
    }
    if(!req.body.estado) {
        req.body.estado = 0;
        /*
            0 => Libre
            1 => Alquilado
            3 => Vendido
        */
    }

    try {
        bd.query(sql.insertModulo(req.body), async (err, response) => {
            if (err) {
                res.json(err)
            }

            if (response) {
                response.todoOk = "Ok";
                res.json(response);
            }

            res.end();
        })
    } catch (error) {
        return res.json(error);
    }
}

//listar todos los modulos existentes
exports.listModulos = async (req, res) => {
    try {
        bd.query(sql.selectModulo(), async (err, response) => {
            if (err) {
                res.json(err);
            }

            if (response) {
                response.statusText = "Ok";
                response.status = 200;
                res.json(response);
            }
            res.end();
        })
    } catch (error) {
        return res.json(error);
    }
}