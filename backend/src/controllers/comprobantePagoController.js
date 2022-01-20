const bd = require('../../pool');
const sql = require('../sql/comprobantePagoQuery');

//listar todos los formas de pago disponibles
exports.listComprobantePago = async (req, res) => {
    try {
        bd.query(sql.selectComprobantePago(), async (err, response) => {
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