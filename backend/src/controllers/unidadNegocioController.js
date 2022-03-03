const { UnidadNegocio } = require('../../db');

//listar todos los formas de pago disponibles
exports.listUnidadesNegocio = async (req, res) => {
    UnidadNegocio.findAll().then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(err => {
        console.error(err);
        return res.json(err);
    });
}