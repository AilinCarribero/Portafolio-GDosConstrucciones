const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Base de Datos
const { Auth, Rango } = require('../../db');

//Busca los usuarios registrados
exports.getUser = async (req, res) => {
    try {
        await Auth.findAll({ 
            include: [{
                model: Rango
            }] 
        }).then( response => {
            res.json(response);
        }).catch( error => {
            res.json(error);
        });

        res.end();
    } catch (error) {
        return res.json(error);
    }
}

//Login
exports.login = async (req, res) => {
    const correo = req.body.correo;
    const password = req.body.password;

    if(correo && password){
        try {
            Auth.findAll({
                include: [{
                    model: Rango
                }],
                where: {
                    correo: correo
                },
                raw: true
            }).then(async response => {
                if(await bcryptjs.compare(password, response[0].contrasegna)) {
                    const rango = response[0]['rango.rango'];
                    const id = response[0].id_user;
                    const nombre_apellido = response[0].nombre_apellido;

                    const token = jwt.sign({id: id , rango: rango, nombre_apellido: nombre_apellido}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_TIME_EXPIRED
                    });

                    res.json({
                        id: id,
                        rango: rango,
                        token: token,
                        nombre_apellido: nombre_apellido
                    });
                } else {
                    res.send('Contraseña incorrecta')
                }
            }).catch( err => {
                console.error(err);
                res.send('Hubo un error desconocido');
                return res.json(err);
            }) 
        } catch (error) {
            res.send('Correo incorrecto');
            console.error(error)
            return res.json(error);
        }
    } else {
        res.send('Por favor ingrese los datos solicitados');
    }
}

//Agrega un nuevo usuario
exports.registrar = async (req, res) => {
    const user = req.body.nombre_apellido;
    const password = req.body.contrasegna;
    const correo = req.body.correo;
    const rango = req.body.id_rango;

    let contrasegna = await bcryptjs.hash(password , 10);

    const data = {
        nombre_apellido: user,
        correo: correo,
        id_rango: rango,
        contrasegna: contrasegna
    }

    try{
        Auth.create(data).then( response => {
            response.todoOk = "Ok";
            res.json(response);
            res.end();
        }).catch( err => {
            console.error(err);
            return res.json(err);
        })
    } catch(error){
        return res.json(error);
    }
    //let passwordHash = bcryptjs.hashSync(password , 10); //Encriptacion-> se pasa como parametro lo que se quiere encriptar y la cantidad de interaciones de encriptacion
    //let passwordHash = await bcryptjs.hash(password , 10);
}