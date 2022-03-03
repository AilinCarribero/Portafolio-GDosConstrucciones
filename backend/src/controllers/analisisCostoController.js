const { AnalisisCosto, DetalleAC } = require('../../db');

//listar todos los analisis de costos disponibles
exports.listAnalisisCosto = async (req, res) => {
    AnalisisCosto.findAll().then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(err => {
        console.error(err);
        return res.json(err);
    });
}

exports.listAnalisisCostosDetalles = async (req, res) => {
    DetalleAC.findAll().then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(err => {
        console.error(err);
        return res.json(err);
    });
}