const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

require('./db');
require('./cron');

// routes
app.use('/api/auth', require('./src/router/authRoute'));
app.use('/api/analisis-costos', require('./src/router/analisisCostosRoute'));
app.use('/api/proyectos', require('./src/router/proyectosRoute'));
app.use('/api/comprobante-pago', require('./src/router/comprobantePagoRoute'));
app.use('/api/centro-costo', require('./src/router/centroCostoRoute'));
app.use('/api/unidad-negocio', require('./src/router/unidadNegocioRoute'));
app.use('/api/modulos', require('./src/router/moduloRoute'));
app.use('/api/alquiler', require('./src/router/alquilerRoute'));
app.use('/api/token', require('./src/router/tokenRoute'));
app.use('/api/ingreso-alquiler', require('./src/router/ingresoAlquilerRoute'));
app.use('/api/cliente', require('./src/router/clienteRoute'));

// port
const port = process.env.PORT || 5030 ;

// listen.port
app.listen(port, () => {
    console.log(`Aplicacion en el puerto ${port}`);
});