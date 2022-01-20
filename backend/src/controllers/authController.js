const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Base de Datos
const bd = require('../../pool');
const sql = require('../sql/authQuery');

//Busca los usuarios registrados
exports.getUser = async (req, res) => {
    try {
        bd.query(sql.selectUsers(), (err, response) => {
            if(err){
                res.json(err);
            }
            if(response){
                response.todoOk = "Ok";
                response.status = 200;

                res.json(response);
            } 
            res.end();
        })   
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
            bd.query(sql.login(correo), async (err, response) => {
                if(err){
                    res.send('Correo incorrecto');
                    res.json(err);
                }
                if(response){
                     if(await bcryptjs.compare(password, response[0].contrasegna)) {
                        const rango = response[0].rango;
                        const id = response[0].id_user;
                        const nombre_apellido = response[0].nombre_apellido;

                        const token = jwt.sign({id: id , rango: rango}, process.env.JWT_SECRET, {
                            expiresIn: process.env.JWT_TIME_EXPIRED
                        })
                        
                        res.json({
                            id: id,
                            rango: rango,
                            token: token,
                            nombre_apellido: nombre_apellido
                        });
                    } else {
                        res.send('Contraseña incorrecta')
                    }
                } else {
                    res.send('Correo incorrecto');
                }
                res.end();
            })   
        } catch (error) {
            res.send('Correo incorrecto');
            return res.json(error);
        }
    }
}

//Agrega un nuevo usuario
exports.registrar = async (req, res) => {
    const user = req.body.nombre_apellido;
    const password = req.body.contrasegna;
    const correo = req.body.correo;
    const rango = req.body.id_rango;

    let passwordHash =await bcryptjs.hash(password , 10);

    try{
        bd.query(`INSERT INTO usuario(nombre_apellido, correo, contrasegna, id_rango) VALUES(
            '${user}',
            '${correo}',
            '${passwordHash}',
            '${rango}'
        )`, (err, response) => {
            if(err){
                res.json(err);
            }
            if(response){
                response.todoOk = "Ok";
                
                res.json(response);
            }
            res.end();
        });
    } catch(error){
        return res.json(error);
    }
    //let passwordHash = bcryptjs.hashSync(password , 10); //Encriptacion-> se pasa como parametro lo que se quiere encriptar y la cantidad de interaciones de encriptacion
    //let passwordHash = await bcryptjs.hash(password , 10);
}