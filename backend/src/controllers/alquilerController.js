const { Alquiler, Modulo, Proyecto } = require("../../db")

exports.insertAlquiler = (req, res) => {
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

exports.getAlquileres = (req, res) => {
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

//Listar alquileres por id de proyecto
exports.getAlquileresId = async (req, res) => {
    const idProyecto = req.params.id.toString().replace(/\%20/g, ' ');

    Alquiler.findAll({
        include: [{
            model: Modulo
        },{
            model: Proyecto
        }],
        where: {
            id_proyecto: idProyecto
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