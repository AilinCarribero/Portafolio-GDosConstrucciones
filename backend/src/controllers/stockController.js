const { Stock, Auth } = require("../../db");
const Decimal = require('decimal.js-light');

//Agregar ingreso
exports.insertStock = async (req, res) => {
    //Para guardar correctamente el valor nos aseguramos que este en un formato que la base de datos entienda
    req.body.valor = req.body.valor.toString().replace(/\./g, '');
    req.body.valor = req.body.valor.replace(/\,/g, '.');
    req.body.valor = parseFloat(req.body.valor);

    req.body.restante_valor = req.body.valor;
    
    try {
        //Inserta el nuevo material
        Stock.create(req.body).then(response => {
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
        }).catch(err => {
            err.todoMal = "Error";

            console.error(err);
            res.json(err);
            throw err;
        })
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
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
    //Para guardar correctamente el valor nos aseguramos que este en un formato que la base de datos entienda
    req.body.mas_stock = req.body.mas_stock.toString().replace(/\./g, '');
    req.body.mas_stock = req.body.mas_stock.replace(/\,/g, '.');
    req.body.mas_stock = parseFloat(req.body.mas_stock);

    const oldRestanteValor = new Decimal(req.body.restante_valor);
    const oldValor = new Decimal(req.body.valor);
    const newValor = new Decimal(req.body.mas_stock);
    const sumRestanteValores = oldRestanteValor.add(newValor).toNumber();
    const sumValores = oldValor.add(newValor).toNumber();

    Stock.update({ restante_valor: sumRestanteValores, valor: sumValores }, {
        where: {
            id_stock: req.body.id_stock
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
        }).catch(error => {
            console.error(error);
            res.json(error);
        });
    }).catch(error => {
        console.error(error);
        res.json(error);
    });
}