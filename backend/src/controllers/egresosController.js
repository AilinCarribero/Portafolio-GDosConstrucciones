const { Egreso, FormaPago, Auth, AnalisisCosto, ComprobantePago } = require('../../db');

//Agregar egreso
exports.insertEgreso = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;;

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
            
            if (parseInt(dato.cuota , 10) == 0) {
                //Para guardar correctamente el valor de pago nos aseguramos que este en un formato que la base de datos entienda
                dato.valor_pago = dato.valor_pago.toString().replace(/\./g, '');
                dato.valor_pago = dato.valor_pago.replace(/\,/g, '.');
                dato.valor_pago = parseFloat(dato.valor_pago);
            }

            Egreso.create(dato).then( response => {
                response.todoOk = "Ok";
                response.statusText = "Ok";


                console.log(datos.length - 1 + ' - ' + i)
                if (datos.length - 1 == i) {
                    res.json(response);
                }
            }).catch( err => {
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
        },{
            model: Auth
        },{
            model: AnalisisCosto
        },{
            model: ComprobantePago
        }]
    }).then( response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch( error => {
        console.error(error);
        res.json(error);
    });
}

//Listar egresos por id de proyecto
exports.listEgresosId = async (req, res) => {
    Egreso.findAll({
        include: [{
            model: FormaPago
        },{
            model: Auth
        },{
            model: AnalisisCosto
        },{
            model: ComprobantePago
        }],
        where: {
            id_proyecto: req.params.id
        }
    }).then( response => {
        response.statusText = "Ok";
        response.status = 200;
        res.json(response);
    }).catch( error => {
        console.error(error);
        res.json(error);
    });
}
