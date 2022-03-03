const { ComprobantePago } = require('../../db');

//listar todos los formas de pago disponibles
exports.listComprobantePago = async (req, res) => {
    ComprobantePago.findAll().then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(err => {
        console.error(err);
        return res.json(err);
    }); 
}