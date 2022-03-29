const { Egreso, FormaPago, Auth, AnalisisCosto, ComprobantePago, Stock } = require('../../db');
const Decimal = require('decimal.js-light');
const { desformatNumber } = require('../utils/numbers');

//Agregar egreso
exports.insertEgreso = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;
    let restante_valor = 0;
    let cantidad = 0;

    try {
        //Inserta el nuevo egreso
        datos.forEach((dato, i) => {
            dato.fecha_diferido_pago = !dato.fecha_diferido_pago ? '1000-01-01' : dato.fecha_diferido_pago;
            dato.cuota = !dato.cuota ? 0 : dato.cuota;
            dato.cuotaNumero = !dato.cuotaNumero ? 0 : dato.cuotaNumero;
            dato.observaciones = !dato.observaciones ? '' : dato.observaciones;
            dato.id_detalle_ac = !dato.id_detalle_ac ? 0 : dato.id_detalle_ac;
            dato.id_comprobante_pago = !dato.id_comprobante_pago ? 6 : dato.id_comprobante_pago;
            dato.numero_comprobante = !dato.numero_comprobante ? 0 : dato.numero_comprobante;

            console.log(dato);
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
                        restante_valor = !restante_valor ? new Decimal(stock.restante_valor) : new Decimal(restante_valor); //Esto viene de la base de datos
                        const front_restante_valor = new Decimal(dato.valor_pago); //Esto viene del front
                        restante_valor = restante_valor.minus(front_restante_valor).toNumber(); //Restamos el valor que se ingreso con el que quedaba disponible

                        if (datos.length - 1 == i) {
                            cantidad = new Decimal(stock.cantidad); //Esto viene de la base de datos
                            const front_cantidad = new Decimal(dato.cantidad); //Esto viene del front
                            cantidad =  cantidad.minus(front_cantidad).toNumber();
                        } else {
                            cantidad = stock.cantidad;
                        }

                        //Modificamos el valor que queda disponible del material
                        Stock.update({ restante_valor: restante_valor, cantidad: cantidad }, {
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
