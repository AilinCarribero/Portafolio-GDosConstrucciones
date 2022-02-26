const { Alquiler, Modulo, Proyecto } = require("../../db")

exports.insertAlquiler = async (req, res) => {
    try {
        Alquiler.create(req.body)
            .then( response => {
                response.todoOk = "Ok";
                console.log(response)
                res.json(response);
            }).catch( error => {
                console.log(error);
                res.json(error);
            })
    } catch (error) {
        return res.json(error);
    }
}

exports.getAlquileres = async (req, res) => {
    try {
        Alquiler.findAll({
            include:{
                model:[Modulo, Proyecto]
            }
        })
    } catch (error) {
        return res.json(error);
    }
}