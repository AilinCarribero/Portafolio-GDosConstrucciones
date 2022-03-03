const { CentroCosto } = require('../../db')

//listar todos los formas de pago disponibles
exports.listCentrosCostos = async (req, res) => {
    CentroCosto.findAll().then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(err => {
        console.error(err);
        return res.json(err);
    });
}