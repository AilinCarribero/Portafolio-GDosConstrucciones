const { Ingreso, FormaCobro, Auth } = require('../../db');

//Agregar ingreso
exports.insertIngreso = async (req, res) => {
    const datos = !req.body.length ? [req.body] : req.body;

    try {
        //Inserta el nuevo ingreso
        datos.forEach(async (dato, i) => {
            dato.fecha_diferido_cobro = !dato.fecha_diferido_cobro ? '1000-01-01' : dato.fecha_diferido_cobro;
            dato.cuota = !dato.cuota ? 0 : dato.cuota;
            dato.cuotaNumero = !dato.cuotaNumero ? 0 : dato.cuotaNumero;
            dato.observaciones = !dato.observaciones ? '' : dato.observaciones;

            Ingreso.create(dato).then(response => {
                response.todoOk = "Ok";
                response.statusText = "Ok";

                console.log(datos.length - 1 + ' - ' + i)
                if (datos.length - 1 == i) {
                    res.json(response);
                }
            }).catch(err => {
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
        }, {
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

//Listar ingresos por id de proyecto
exports.listIngresosId = async (req, res) => {
    const idProyecto = req.params.id.toString().replace(/\%20/g, ' ');

    Ingreso.findAll({
        include: [{
            model: FormaCobro
        }, {
            model: Auth
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

//Modificar ingreso
exports.updateIngreso = async (req, res) => {
    const ingreso = req.body;

    ingreso.fecha_diferido_cobro = !ingreso.fecha_diferido_cobro ? '1000-01-01' : ingreso.fecha_diferido_cobro;
    ingreso.cuota = !ingreso.cuota ? 0 : ingreso.cuota;
    ingreso.cuotaNumero = !ingreso.cuotaNumero ? 0 : ingreso.cuotaNumero;
    ingreso.observaciones = !ingreso.observaciones ? '' : ingreso.observaciones;

    Ingreso.update(ingreso, {
        where: {
            id_ingreso: ingreso.id_ingreso
        }
    }).then(response => {
        Ingreso.findAll({
            include: [{
                model: FormaCobro
            }, {
                model: Auth
            }],
            where: {
                id_proyecto: ingreso.id_proyecto
            }
        }).then(response => {
            response.statusText = "Ok";
            response.status = 200;

            res.json(response);
        }).catch(err => {
            err.todoMal = "Error al actualizar el ingreso";
            console.error(err);
            res.json(err);
            throw err;
        });
    }).catch(err => {
        err.todoMal = "Error al actualizar el ingreso";
        console.error(err);
        res.json(err);
        throw err;
    })
}

//Eliminar ingreso
exports.deleteIngreso = async (req, res) => {
    const idIngreso = req.params.id.toString().replace(/\%20/g, ' ');
    const ingreso = req.body;
console.log(idIngreso)
    Ingreso.destroy({
        where: {
            id_ingreso: idIngreso
        },
        include: [{
            model: FormaCobro
        }, {
            model: Auth
        }]
    }).then(response => {
        Ingreso.findAll({
            include: [{
                model: FormaCobro
            }, {
                model: Auth
            }],
            where: {
                id_proyecto: ingreso.id_proyecto
            }
        }).then(response => {
            response.statusText = "Ok";
            response.status = 200;

            res.json(response);
        }).catch(err => {
            err.todoMal = "Error al eliminar el ingreso";
            console.error(err);
            res.json(err);
            throw err;
        });
    }).catch(err => {
        err.todoMal = "Error al eliminar el ingreso";
        console.error(err);
        res.json(err);
        throw err;
    })
}