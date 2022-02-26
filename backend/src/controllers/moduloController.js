const { Modulo, Alquiler } = require('../../db');
const bd = require('../../pool');
const sql = require('../sql/moduloQuery');

//Insertar un modulo nuevo
exports.insertModulo = async (req, res) => {
    if (!req.body.fecha_venta) {
        req.body.fecha_venta = '1000-01-01';
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
        Modulo.create(req.body).then( response => {
            response.todoOk = "Ok";
            res.json(response);
        }).catch(err => {
            console.error(err)
            return res.json(err)
        })
    } catch (error) {
        return res.json(error);
    }
}

//listar todos los modulos existentes
exports.listModulos = async (req, res) => {
    try {
        await Modulo.findAll({
            include: [{
                model: Alquiler
            }] 
        }).then( response => {
            res.json(response);
        }).catch( error => {
            console.error(error)
            res.json(error);
        });

        res.end();
    } catch (error) {
        return res.json(error);
    }
}