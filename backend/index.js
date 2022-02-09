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

// routes
app.use('/api/auth', require('./src/router/authRoute'));
app.use('/api/egresos', require('./src/router/egresosRoute'));
app.use('/api/ingresos', require('./src/router/ingresosRoute'));
app.use('/api/analisis-costos', require('./src/router/analisisCostosRoute'));
app.use('/api/formas-pago', require('./src/router/formasPagoRoute'));
app.use('/api/formas-cobro', require('./src/router/formasCobroRoute'));
app.use('/api/proyectos', require('./src/router/proyectosRoute'));
app.use('/api/comprobante-pago', require('./src/router/comprobantePagoRoute'));
app.use('/api/centro-costo', require('./src/router/centroCostoRoute'));
app.use('/api/unidad-negocio', require('./src/router/unidadNegocioRoute'));
app.use('/api/modulos', require('./src/router/moduloRoute'));

// port
const port = process.env.PORT || 5030 ;

// listen.port
app.listen(port, () => {
    console.log(`Aplicacion en el puerto ${port}`);
});