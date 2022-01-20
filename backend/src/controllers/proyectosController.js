const bd = require('../../pool');
const sql = require('../sql/proyectosQuery');
const sqlUnidadNegocio = require('../sql/unidadNegocioQuery');
const sqlCentroCosto = require('../sql/centroCostoQuery');

//listar todos los formas de pago disponibles
exports.listProyectos = async (req, res) => {
    try {
        bd.query(sql.listProyectos(), async (err, response) => {
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

//Insertar un proyecto nuevo
exports.insertProyecto = async (req, res) => {
    if(!req.body.costo){
        req.body.costo = 0;
    }
    if(!req.body.venta){
        req.body.venta = 0;
    }
    /*if(!req.body.fecha_f_proyecto){
        req.body.fecha_f_proyecto = NULL;
    }*/

    try {
        bd.query(sqlCentroCosto.busquedaIdCentroCosto(req.body.id_centro_costo), async (err, response) => {
            if (err) {
                res.json(err);
            }
            if (response) {
                req.centroCosto = await response[0].siglas_cc;

                //buscamos la unidad de negocio
                bd.query(sqlUnidadNegocio.busquedaIdUnidadNegocio(req.body.id_unidad_negocio), async (err, response) => {
                    if (err) {
                        res.json(err);
                    }
                    if (response) {
                        req.unidadNegocio = await response[0].siglas_uc;
                        
                        if (req.centroCosto && req.unidadNegocio) {
                            //armamos el id del proyecto
                            if(req.body.cliente){
                                req.body.id_proyecto = req.centroCosto + '-' + req.unidadNegocio + '-' + req.body.cliente;
                            } else {
                                req.body.id_proyecto = req.centroCosto + '-' + req.unidadNegocio;
                            }
                            //insertamos en la base de datos la informacion
                            bd.query(sql.insertProyecto(req.body), async (err, response) => {
                                if (err) {
                                    res.json(err);
                                }
                                if (response) {
                                    response.todoOk = "Ok";
                                    
                                    res.json(response);
                                }
                                res.end();
                            })
                        } else {
                            res.json('error, un elemento esta vacio');
                        }

                    }
                })
            }
        })
    } catch (error) {
        return res.json(error);
    }
}
