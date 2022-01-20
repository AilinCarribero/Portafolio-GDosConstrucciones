const { response } = require('express');
const bd = require('../../pool');
const sql = require('../sql/ingresosQuery');

//Agregar ingreso
exports.insertIngreso = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;

    try {
        //Inserta el nuevo ingreso
        datos.forEach(async (dato, i) => {
            if (!dato.fecha_diferido_cobro) {
                dato.fecha_diferido_cobro = '0-0-0';
            }
            if (!dato.cuota) {
                dato.cuota = 0;
            }
            if (!dato.cuotaNumero) {
                dato.cuotaNumero = 0;
            }
            if (!dato.observaciones) {
                dato.observaciones = '';
            }
            if (parseInt(dato.cuota , 10) == 0) {
                //Para guardar correctamente el valor de cobro nos aseguramos que este en un formato que la base de datos entienda
                dato.valor_cobro = dato.valor_cobro.toString().replace(/\./g, '');
                dato.valor_cobro = dato.valor_cobro.replace(/\,/g, '.');
                dato.valor_cobro = parseFloat(dato.valor_cobro);
            }

            bd.query(sql.insertIngreso(dato), (err, response) => {
                if (err) {
                    err.todoMal = "Error";

                    res.json(err)
                    throw err;
                } 
                if (response) {
                    response.todoOk = "Ok";
                    
                    if(datos.length-1 == i){
                        res.json(response);
                    }   
                }
            })
        })
    } catch (error) {
        return res.json(error);
    }
}

//Listar ingresos
exports.listIngresos = async (req, res) => {
    try {
        bd.query(sql.listIngresos(), (err, response) => {
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

//Listar ingresos por id de proyecto
exports.listIngresosId = async (req, res) => {
    try {
        bd.query(sql.listIngresosId(req.params.id), (err, response) => {
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