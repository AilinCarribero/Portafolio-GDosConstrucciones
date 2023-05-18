const { Cliente } = require("../../db");

exports.getClientes = (req, res) => {
    try {
        Cliente.findAll().then(response => {
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