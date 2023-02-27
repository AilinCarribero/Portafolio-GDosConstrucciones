const { IngresoAlquiler, Proyecto, Modulo, Alquiler, ModuloDoble } = require("../../db");

exports.insertIngresoAlquiler = (req, res) => {
    try {
        IngresoAlquiler.create(req.body)
            .then(response => {
                Proyecto.findAll({
                    include: [{
                        model: Alquiler,
                        include: [{
                            model: Modulo
                        }, {
                            model: IngresoAlquiler
                        }, {
                            model: ModuloDoble,
                            include: [{
                                model: Modulo,
                                as: 'moduloUno',
                                include: [{
                                    model: Alquiler
                                },
                                ]
                            }, {
                                model: Modulo,
                                as: 'moduloDos',
                                include: [{
                                    model: Alquiler
                                },
                                ]
                            }],
                        }]
                    }],
                    order: [['id_estado', 'ASC'], ['fecha_f_proyecto', 'ASC'], [Alquiler, 'fecha_d_alquiler', 'ASC']]
                }).then(response => {
                    response.todoOk = "Ok";
                    res.json(response);
                }).catch(error => {
                    console.error(error);
                    res.json(error);
                });
            }).catch(error => {
                console.error(error);
                res.json(error);
            })
    } catch (error) {
        return res.json(error);
    }
}