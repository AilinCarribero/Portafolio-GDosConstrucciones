const { Alquiler, Modulo, Proyecto } = require("../../db")

exports.insertAlquiler = (req, res) => {
    try {
        Alquiler.create(req.body)
            .then(response => {
                response.todoOk = "Ok";
                console.log(response)
                res.json(response);
            }).catch(error => {
                console.log(error);
                res.json(error);
            })
    } catch (error) {
        return res.json(error);
    }
}

exports.getAlquileres = (req, res) => {
    try {
        Alquiler.findAll({
            include: {
                model: [Modulo, Proyecto]
            }
        })
    } catch (error) {
        return res.json(error);
    }
}

//Listar alquileres por id de proyecto
exports.getAlquileresId = async (req, res) => {
    const idProyecto = req.params.id.toString().replace(/\%20/g, ' ');

    Alquiler.findAll({
        include: [{
            model: Modulo
        }, {
            model: Proyecto
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

exports.updateContrato = async (req, res) => {
    const action = req.body.action;

    const updateProyecto = {
        id_proyecto: req.body.id_proyecto,
        alquiler_total: req.body.alquiler_total,
        fecha_f_proyecto: req.body.proyecto.fecha_f_proyecto ? (new Date(req.body.fecha_h_alquiler) >= new Date(req.body.proyecto.fecha_f_proyecto) ? new Date(req.body.fecha_h_alquiler).toISOString().slice(0, 10) : new Date(req.body.proyecto.fecha_f_proyecto).toISOString().slice(0, 10)) : null,
        id_estado: new Date(req.body.fecha_h_alquiler) >= new Date() ? 2 : 3
    }

    const newAlquiler = {
        id_modulo: req.body.id_modulo,
        id_proyecto: req.body.id_proyecto,
        valor: req.body.valor,
        fecha_d_alquiler: req.body.fecha_d_alquiler,
        fecha_h_alquiler: req.body.fecha_h_alquiler
    }

    /*Si la fecha de inicio del aquiler es anterior a hoy entonces se debe actualizar el estado del modulo */
    if (new Date(newAlquiler.fecha_d_alquiler) <= new Date()) {
        Modulo.update({ estado: 1 }, {
            where: {
                id_modulo: newAlquiler.id_modulo
            }
        }).then(response => { }).catch(err => {
            err.todoMal = "Error al actualizar el estado del módulo";
            console.error(err)
            res.json(err);
        });
    }

    Proyecto.update({ alquiler_total: updateProyecto.alquiler_total, fecha_f_proyecto: updateProyecto.fecha_f_proyecto, id_estado: updateProyecto.id_estado  }, {
        where: {
            id_proyecto: updateProyecto.id_proyecto
        }
    }).then(response => {
        if (action === "modificar") {
            Alquiler.update(newAlquiler, {
                where: {
                    id_alquiler: req.body.id_alquiler
                }
            }).then(response => {
                Alquiler.findAll({
                    include: [{
                        model: Modulo
                    }, {
                        model: Proyecto
                    }],
                    where: {
                        id_proyecto: updateProyecto.id_proyecto
                    }
                }).then(response => {
                    response.statusText = "Ok";
                    response.status = 200;
                    res.json(response);
                }).catch(error => {
                    err.todoMal = `Error al buscar los alquileres del proyecto ${updateProyecto.id_proyecto}`;
                    console.error(error);
                    res.json(error);
                });
            }).catch(err => {
                err.todoMal = `Error al modificar el alquiler del módulo ${req.body.nombre_modulo}`;
                console.error(err)
                res.json(err);
            })
        } else {
            Alquiler.create(newAlquiler).then(response => {
                Alquiler.findAll({
                    include: [{
                        model: Modulo
                    }, {
                        model: Proyecto
                    }],
                    where: {
                        id_proyecto: updateProyecto.id_proyecto
                    }
                }).then(response => {
                    response.statusText = "Ok";
                    response.status = 200;
                    res.json(response);
                }).catch(error => {
                    err.todoMal = `Error al buscar los alquileres del proyecto ${updateProyecto.id_proyecto}`;
                    console.error(error);
                    res.json(error);
                });
            }).catch(err => {
                err.todoMal = `Error al ingresar el nuevo alquiler del módulo ${req.body.nombre_modulo}`;
                console.error(err)
                res.json(err);
            })
        }
    }).catch(err => {
        err.todoMal = "Error al actualizar el valor total del alquiler en el proyecto";
        console.error(err)
        res.json(err);
    })
}
