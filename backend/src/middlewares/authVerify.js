const jwt = require('jsonwebtoken');

//Base de datos
const { Auth, Token } = require('../../db');

exports.verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];

        if(!authorization || !authorization.toLowerCase().startsWith('bearer')) {
            return res.status(403).json({message: "No existe el token"});
        } else {
            const token = authorization.substring(7);

            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //const user = await bd.query(sqlUser.busquedaIdUser(decoded.id)); //Si esto no funciona crear una busqueda que solo devuelva el id
            const user = await Auth.findAll({
                where: {
                    id_user: decoded.id
                },
                raw: true
            });
            
            req.userId = user[0].id_user;
            req.userRango = user[0].id_rango;

            if(!user){
                return res.status(404).json({message: "No existe el usuario"});
            }

            next();
        }
    } catch (error) {
        return res.status(405).json({message: error});
    }
}

exports.verifyAdmin = async (req, res, next) => {
    //console.log(req.userId);
    //console.log(req.userRango);
    /* ESTO NO SE ESTA USANDO */
    //const userRango = await bd.query(sqlRango.busquedaRango(req.userRango));

    if(userRango == 'admin') {
        next()
    } else {
        return res.status(410).json({message: "No posee los permisos necesarios"})
    }

}

exports.verifyMedio = async (req, res, next) => {

}

exports.verifyBasicAuth = async (req, res, next) => {
    const auth = req.get('authorization');

    const token = await Token.findOne({ where: { uso: 'QRmodulos' }});

    if(!auth) {
        console.error('No existe el encabezado authorization')
    } else {
        const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

        const user = credentials[0];
        const password = credentials[1];

        if(!(user === 'GDosConstrucciones' && password === token.token)) {
            const err = new Error('Not Authenticated!');

            res.status(401).set('WWW-Authenticate', 'Basic');
            next(err);
        } else {
            res.status(200);
            next();
        }
    }
}