const util = require('util');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,//process.env.HOST,
    database: process.env.DB_NAME,//process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,//process.env.DB_USER,
    password: process.env.DB_PASSWORD,//process.env.DB_PASSWORD,
    waitForConnections: true,
    debug: false
})

connection.connect(err => {
    if(err){
        console.log('Error de conexion con la bd: ' + err);
        throw err;
    } else {
        console.log('Conexion con la BD exitosa: '+ process.env.DB_NAME);
        //connection.release();
    }
    return;
})

connection.query = util.promisify(connection.query);

module.exports = connection;