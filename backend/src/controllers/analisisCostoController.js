const bd = require('../../pool');
const sql = require('../sql/analisisCostoQuery');
const sqlDAC = require('../sql/detalleACQuery');

//listar todos los analisis de costos disponibles
exports.listAnalisisCosto = async (req, res) => {
    try {
        bd.query(sql.selectAnalisisCosto() , async (err, response) => {
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

exports.listAnalisisCostosDetalles = async (req, res) => {
    try {
        bd.query(sqlDAC.selectDetalleAC() , async (err, response) => {
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
        console.log(error);
        return res.json(error);
    }  
}