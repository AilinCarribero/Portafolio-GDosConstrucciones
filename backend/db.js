const Sequelize = require('sequelize');

//Declaro los modelos
const AlquilerModel = require('./src/models/alquilerModel');
const AnalisisCostoModel = require('./src/models/analisisCostoModel');
const AuthModel = require('./src/models/authModel');
const CentroCostoModel = require('./src/models/centroCostoModel');
const ComprobantePagoModel = require('./src/models/comprobantePagoModel');
const DetalleACModel = require('./src/models/detalleACModel');
const EgresoModel = require('./src/models/egresoModel');
const EstadoModel = require('./src/models/estadoModel');
const FormaCobroModel = require('./src/models/formaCobroModel');
const FormaPagoModel = require('./src/models/formaPagoModel');
const IndiceModel = require('./src/models/indiceModel');
const IngresoModel = require('./src/models/ingresoModel');
const ModuloModel = require('./src/models/moduloModel');
const ProyectoModel = require('./src/models/proyectoModel');
const RangoModel = require('./src/models/rangoModel');
const StockModel = require('./src/models/stockModel');
const UnidadNegocioModel = require('./src/models/unidadNegocioModel');

//Declaro la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        alter: true, // cuando se realice un cambio en algun modelo o relacion pasar a true
        modelName: 'singularName'
    },
});

//Utilizo los modelos
const Alquiler = AlquilerModel(sequelize, Sequelize);
const AnalisisCosto = AnalisisCostoModel(sequelize, Sequelize);
const Auth = AuthModel(sequelize, Sequelize);
const CentroCosto = CentroCostoModel(sequelize, Sequelize);
const ComprobantePago = ComprobantePagoModel(sequelize, Sequelize);
const DetalleAC = DetalleACModel(sequelize, Sequelize);
const Egreso = EgresoModel(sequelize, Sequelize);
const Estado = EstadoModel(sequelize, Sequelize);
const FormaCobro = FormaCobroModel(sequelize, Sequelize);
const FormaPago = FormaPagoModel(sequelize, Sequelize);
const Indice = IndiceModel(sequelize, Sequelize);
const Ingreso = IngresoModel(sequelize, Sequelize);
const Modulo = ModuloModel(sequelize, Sequelize);
const Proyecto = ProyectoModel(sequelize, Sequelize);
const Rango = RangoModel(sequelize, Sequelize);
const Stock = StockModel(sequelize, Sequelize);
const UnidadNegocio = UnidadNegocioModel(sequelize, Sequelize);

/*Conecto con la base de datos, verifico que esten los modelos creados, si no lo estan los crea 
 logging tiene que pasar a true cuando se mande a produccion */
sequelize.sync({ force: false, logging: false }).then(() => {
    //Relaciones
    Auth.belongsTo(Rango, { foreignKey: 'id_rango', targetKey: 'id_rango' });
    Auth.hasMany(Stock, { foreignKey: 'id_user', targetKey: 'id_user' });
    Rango.belongsTo(Auth, { foreignKey: 'id_rango', targetKey: 'id_rango' });
    Alquiler.belongsTo(Modulo, { foreignKey: 'id_modulo', targetKey: 'id_modulo' });
    Alquiler.belongsTo(Proyecto, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' });
    Modulo.hasMany(Alquiler, { foreignKey: 'id_modulo', targetKey: 'id_modulo' });
    Proyecto.hasMany(Alquiler, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' });
    Proyecto.hasMany(Egreso, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' });
    Proyecto.hasMany(Ingreso, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' });
    Egreso.belongsTo(FormaPago, { foreignKey: 'id_forma_pago', targetKey: 'id_forma_pago' });
    Egreso.belongsTo(Auth, { foreignKey: 'id_user', targetKey: 'id_user' });
    Egreso.belongsTo(AnalisisCosto, { foreignKey: 'id_analisis_costo', targetKey: 'id_analisis_costo' });
    Egreso.belongsTo(ComprobantePago, { foreignKey: 'id_comprobante_pago', targetKey: 'id_comprobante_pago' });
    Egreso.belongsTo(Stock, { foreignKey: 'id_stock', targetKey: 'id_stock' });
    Ingreso.belongsTo(FormaCobro, { foreignKey: 'id_forma_cobro', targetKey: 'id_forma_cobro' });
    Ingreso.belongsTo(Auth, { foreignKey: 'id_user', targetKey: 'id_user' });
    Stock.hasMany(Egreso, { foreignKey: 'id_stock', targetKey: 'id_stock' });
    Stock.belongsTo(Auth, { foreignKey: 'id_user', targetKey: 'id_user' });
    
    console.log('La sincronizacion con la base de datos ' + process.env.DB_NAME + ' fue un exito');
}).catch(err => {
    console.error(err)
})

module.exports = {
    Alquiler, AnalisisCosto, Auth, CentroCosto, ComprobantePago, DetalleAC, Egreso, Estado, FormaCobro, FormaPago,
    Indice, Ingreso, Modulo, Proyecto, Rango, Stock, UnidadNegocio
}