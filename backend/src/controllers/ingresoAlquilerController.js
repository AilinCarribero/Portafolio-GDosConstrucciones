const { IngresoAlquiler } = require("../../db");

exports.insertIngresoAlquiler = (req, res) => {
    try {
        IngresoAlquiler.create(req.body)
            .then(response => {
                response.todoOk = "Ok";
                res.json(response);
            }).catch(error => {
                console.error(error);
                res.json(error);
            })
    } catch (error) {
        return res.json(error);
    }
}