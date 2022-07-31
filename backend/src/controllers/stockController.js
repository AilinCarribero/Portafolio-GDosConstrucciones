const { Stock, Auth, Egreso, Proyecto, AnalisisCosto, StockMovimiento } = require("../../db");
const Decimal = require('decimal.js-light');
const { desformatNumber } = require("../utils/numbers");
const { Sequelize } = require("sequelize");

//Agregar stock
exports.insertStock = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;

    const analisis_costo = await AnalisisCosto.findOne({
        where: {
            analisis_costo: 'Acopio de Materiales'
        },
        raw: true
    });

    datos.forEach((dato, i) => {
        const egreso = {
            id_proyecto: dato.proyecto,
            fecha_pago: dato.fecha_pago,
            fecha_diferido_pago: dato.fecha_diferido_pago ? dato.fecha_diferido_pago : '1000-01-01',
            id_forma_pago: dato.id_forma_pago,
            id_user: dato.id_user,
            id_analisis_costo: analisis_costo.id_analisis_costo,
            valor_pago: dato.valor_pago,
            observaciones: dato.observaciones ? dato.nombre_stock + ' - ' + dato.observaciones : dato.nombre_stock,
            cuotas: dato.cuota,
            cuota: dato.cuotaNumero,
            id_comprobante_pago: dato.id_comprobante_pago ? dato.id_comprobante_pago : 6,
            numero_comprobante: dato.numero_comprobante,
            proveedor: dato.proveedor ? dato.proveedor : '',
        }

        Egreso.create(egreso).then(response => {
            if (datos.length - 1 == i) {
                const stock = {
                    nombre_stock: dato.nombre_stock,
                    //valor: dato.valor,
                    restante_valor: dato.restante_valor,
                    salida: dato.salida,
                    id_user: dato.id_user,
                    //valor_unidad: dato.valor_unidad,
                    //cantidad: dato.cantidad,
                    //medida: dato.medida
                }

                //Insertar el nuevo material
                Stock.create(stock).then(response => {
                    Stock.findAll({
                        include: [{
                            model: Auth
                        }]
                    }).then(response => {
                        const dataStock = response;
                        //Buscamos el ultimo elemento ingresado
                        Stock.findAll({
                            attributes: [[Sequelize.fn('max', Sequelize.col('id_stock')), 'ultimoId']],
                            include: [{
                                model: Auth
                            }],

                            raw: true
                        }).then(response => {
                            const stockMovimiento = {
                                id_stock: response[0].ultimoId,
                                cantidad: dato.cantidad,
                                valor_unidad: dato.valor_unidad,
                                valor_total: dato.valor,
                                medida: dato.medida,
                                id_user: dato.id_user,
                            }

                            console.log(stockMovimiento)
                            StockMovimiento.create(stockMovimiento).then(response => {
                                dataStock.statusText = "Ok";
                                dataStock.status = 200;
                                res.json(dataStock);
                            }).catch(err => {
                                err.todoMal = "Error al guardar el material";
                                console.error(err);
                                res.json(err);
                                throw err;
                            })
                        }).catch(err => {
                            err.todoMal = "Error al guardar el material";
                            console.error(err);
                            res.json(err);
                            throw err;
                        })
                    }).catch(err => {
                        err.todoMal = "Error al guardar el material";
                        console.error(err);
                        res.json(err);
                        throw err;
                    });
                }).catch(err => {
                    err.todoMal = "Error al guardar el material";
                    console.error(err);
                    res.json(err);
                    throw err;
                })
            }
        }).catch(err => {
            err.todoMal = "Error al guardar el material";
            console.error(err);
            res.json(err);
            throw err;
        })
    });
}

//Listar stock
exports.listStock = async (req, res) => {
    Stock.findAll({
        include: [{
            model: Auth
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

exports.updateStockRestante = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;

    const analisis_costo = await AnalisisCosto.findOne({
        where: {
            analisis_costo: 'Acopio de Materiales'
        },
        raw: true
    });

    datos.forEach((dato, i) => {
        console.log(dato);
        const egreso = {
            id_proyecto: dato.proyecto ? dato.proyecto : 'CCE',
            fecha_pago: dato.fecha_pago,
            fecha_diferido_pago: dato.fecha_diferido_pago ? dato.fecha_diferido_pago : dato.fecha_pago,
            id_forma_pago: dato.id_forma_pago,
            id_user: dato.id_user,
            id_analisis_costo: analisis_costo.id_analisis_costo,
            valor_pago: dato.valor_pago,
            observaciones: dato.observaciones ? dato.nombre_stock + ' - ' + dato.observaciones : dato.nombre_stock,
            cuotas: dato.cuota,
            cuota: dato.cuotaNumero,
            id_comprobante_pago: dato.id_comprobante_pago ? dato.id_comprobante_pago : 6,
            numero_comprobante: dato.numero_comprobante,
            proveedor: dato.proveedor ? dato.proveedor : ''
        }

        Egreso.create(egreso).then(response => {
            if (datos.length - 1 == i) {
                const stock = {
                    valor: dato.new_valor_total,
                    restante_valor: dato.restante_total,
                    valor_unidad: dato.valor_unidad,
                    cantidad: dato.cantidad,
                }

                //Modificar el stock
                Stock.update(stock, {
                    where: {
                        id_stock: dato.id_stock
                    }
                }).then(response => {
                    Stock.findAll({
                        include: [{
                            model: Auth
                        }]
                    }).then(response => {
                        response.statusText = "Ok";
                        response.status = 200;
                        res.json(response);
                    }).catch(err => {
                        err.todoMal = "Error al actualizar el material";
                        console.error(err);
                        res.json(err);
                        throw err;
                    });
                }).catch(err => {
                    err.todoMal = "Error al actualizar el material";
                    console.error(err);
                    res.json(err);
                    throw err;
                })
            }
        }).catch(err => {
            err.todoMal = "Error al actualizar el material";
            console.error(err);
            res.json(err);
            throw err;
        })
    });
}