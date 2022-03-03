const { Ingreso, FormaCobro, Auth } = require('../../db');

//Agregar ingreso
exports.insertIngreso = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;

    try {
        //Inserta el nuevo ingreso
        datos.forEach(async (dato, i) => {
            if (!dato.fecha_diferido_cobro) {
                dato.fecha_diferido_cobro = '1000-01-01';
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
            
            Ingreso.create(dato).then( response => {
                response.todoOk = "Ok";

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
        })
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}

//Listar ingresos
exports.listIngresos = async (req, res) => {
    Ingreso.findAll({
        include: [{
            model: FormaCobro
        },{
            model: Auth
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

//Listar ingresos por id de proyecto
exports.listIngresosId = async (req, res) => {
    Ingreso.findAll({
        include: [{
            model: FormaCobro
        },{
            model: Auth
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