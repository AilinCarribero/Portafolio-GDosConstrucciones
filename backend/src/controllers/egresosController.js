const { Egreso, FormaPago, Auth, AnalisisCosto, ComprobantePago, Stock } = require('../../db');
const Decimal = require('decimal.js-light');

//Agregar egreso
exports.insertEgreso = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;
    let restante_valor = 0;
    
    try {
        //Inserta el nuevo egreso
        datos.forEach((dato, i) => {
            if (!dato.fecha_diferido_pago) {
                dato.fecha_diferido_pago = '1000-01-01';
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

            if (!dato.id_detalle_ac) {
                dato.id_detalle_ac = 0;
            }

            if (!dato.id_comprobante_pago) {
                dato.id_comprobante_pago = 6
            }

            if (!dato.numero_comprobante) {
                dato.numero_comprobante = 0
            }

            if (parseInt(dato.cuota, 10) == 0) {
                //Para guardar correctamente el valor de pago nos aseguramos que este en un formato que la base de datos entienda
                dato.valor_pago = dato.valor_pago.toString().replace(/\./g, '');
                dato.valor_pago = dato.valor_pago.replace(/\,/g, '.');
                dato.valor_pago = parseFloat(dato.valor_pago);
            }

            Egreso.create(dato).then(response => {
                //Si tiene un id_stock significa que va a manejar material en stock
                if (dato.id_stock) {
                    //Buscamos el material que va a utilizar
                    Stock.findOne({
                        where: {
                            id_stock: dato.id_stock
                        },
                        raw: true
                    }).then(stock => {
                        restante_valor = new Decimal(stock.restante_valor);
                        aux_restante_valor = new Decimal(dato.valor_pago);

                        //Restamos el valor que se ingreso con el que quedaba disponible
                        restante_valor = restante_valor.minus(aux_restante_valor).toNumber();

                        //Modificamos el valor que queda disponible del material
                        Stock.update({ restante_valor: restante_valor }, {
                            where: {
                                id_stock: dato.id_stock
                            }
                        }).then(response => {
                            response.todoOk = "Ok";
                            response.statusText = "Ok";

                            //console.log(datos.length - 1 + ' - ' + i)
                            if (datos.length - 1 == i) {
                                res.json(response);
                            }
                        }).catch(err => {
                            err.todoMal = "Error";
                            console.error(err);
                            res.json(err);
                            throw err;
                        });
                    }).catch(err => {
                        err.todoMal = "Error";
                        console.error(err);
                        res.json(err);
                        throw err;
                    });
                } else {
                    response.todoOk = "Ok";
                    response.statusText = "Ok";

                    //console.log(datos.length - 1 + ' - ' + i)
                    if (datos.length - 1 == i) {
                        res.json(response);
                    }
                }
            }).catch(err => {
                err.todoMal = "Error";
                console.error(err);
                res.json(err);
                throw err;
            })
        });
    } catch (error) {
        return res.json(error);
    }
}

//Listar egresos
exports.listEgresos = async (req, res) => {
    Egreso.findAll({
        include: [{
            model: FormaPago
        }, {
            model: Auth
        }, {
            model: AnalisisCosto
        }, {
            model: ComprobantePago
        }]
    }).then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(error => {
        console.error(error);
        res.json(error);
    });
}

//Listar egresos por id de proyecto
exports.listEgresosId = async (req, res) => {
    const idProyecto = req.params.id.toString().replace(/\%20/g, ' ');

    Egreso.findAll({
        include: [{
            model: FormaPago
        }, {
            model: Auth
        }, {
            model: AnalisisCosto
        }, {
            model: ComprobantePago
        }],
        where: {
            id_proyecto: idProyecto
        }
    }).then(response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch(error => {
        console.error(error);
        res.json(error);
    });
}
