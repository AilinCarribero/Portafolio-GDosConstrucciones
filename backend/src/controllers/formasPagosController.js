const { FormaPago } = require('../../db');

//listar todos los formas de pago disponibles
exports.listFormasPago = async (req, res) => {
    FormaPago.findAll().then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(err => {
        console.error(err);
        return res.json(err);
    });
}