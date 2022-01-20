const bd = require('../../pool');
const sql = require('../sql/unidadNegocioQuery');

//listar todos los formas de pago disponibles
exports.listUnidadesNegocio = async (req, res) => {
    try {
        bd.query(sql.selectUnidadNegocio(), async (err, response) => {
            if(err){
                res.json(err);
            }
            if(response){
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