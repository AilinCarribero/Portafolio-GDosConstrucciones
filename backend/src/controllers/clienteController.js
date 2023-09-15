const { Cliente, Proyecto } = require("../../db");

exports.getClientes = (req, res) => {
    try {
        Cliente.findAll({
            include: [{
                model: Proyecto
            }]
        }).then(response => {
            res.json(response);
        }).catch(err => {
            console.error(err);
            err.todoMal = "Error inesperado al encontrar clientes";
            return res.json(err);
        });
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}

exports.newCliente = (req, res) => {
    const data = {
        nombre: req.body.nombre || null,
        razon_social: req.body.razon_social || null,
        cuit_cuil: req.body.cuit_cuil || null,
        telefono: req.body.telefono || null,
        correo: req.body.correo || null,
        direccion: req.body.direccion || null
    }

    try {
        Cliente.create(data).then(response => {
            Cliente.findAll().then(response => {
                res.json(response);
            }).catch(err => {
                console.error(err);
                err.todoMal = "Error inesperado al encontrar clientes";
                return res.json(err);
            });
        }).catch(err => {
            console.error(err);
            err.todoMal = "Error inesperado al querer agregar un cliente";
            return res.json(err);
        })
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
}

exports.updateCliente = (req, res) => {
    const data = {
        nombre: req.body.nombre || null,
        razon_social: req.body.razon_social || null,
        cuit_cuil: req.body.cuit_cuil || null,
        telefono: req.body.telefono || null,
        correo: req.body.correo || null,
        direccion: req.body.direccion || null
    }

    if (req.body.id_cliente) {
        try {
            Cliente.update(data, {
                where: {
                    id_cliente: req.body.id_cliente
                }
            }).then(response => {
                Cliente.findAll().then(response => {
                    res.json(response);
                }).catch(err => {
                    console.error(err);
                    err.todoMal = "Error inesperado al encontrar clientes";
                    return res.json(err);
                });
            }).catch(err => {
                console.error(err);
                err.todoMal = "Error inesperado al querer modificar un cliente";
                return res.json(err);
            })

        } catch (err) {
            console.error(err);
            err.todoMal = "Error inesperado al querer modificar un cliente";
            return res.json(err);
        }
    } else {
        return res.json('No existe el id del cliente');
    }
}

exports.deleteCliente = (req, res) => {
    const id_cliente = req.params.id;
    /* 
        Eliminar cliente
        Buscar e eliminar proyectos con id del cliente eliminado
     */

    Proyecto.destroy({
        where: {
            id_cliente: id_cliente
        }
    }).then(proyectos => {
        Cliente.destroy({
            where: {
                id_cliente: id_cliente
            }
        }).then(cliente => {
            Cliente.findAll().then(response => {
                res.json(response);
            }).catch(err => {
                console.error(err);
                err.todoMal = "Error inesperado al encontrar clientes";
                return res.json(err);
            });
        }).catch(err => {
            console.error(err);
            console.error('Error al eliminar el cliente')
            return res.json(err);
        })
    }).catch(err => {
        console.error(err);
        console.error('Error al eliminar proyectos')
        return res.json(err);
    })
}