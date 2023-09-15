const Sequelize = require('sequelize');

//Declaro los modelos
const AlquilerModel = require('./src/models/alquilerModel');
const AnalisisCostoModel = require('./src/models/analisisCostoModel');
const AuthModel = require('./src/models/authModel');
const CentroCostoModel = require('./src/models/centroCostoModel');
const ComprobantePagoModel = require('./src/models/comprobantePagoModel');
const DetalleACModel = require('./src/models/detalleACModel');
const EstadoModel = require('./src/models/estadoModel');
const ModuloModel = require('./src/models/moduloModel');
const ProyectoModel = require('./src/models/proyectoModel');
const RangoModel = require('./src/models/rangoModel');
const UnidadNegocioModel = require('./src/models/unidadNegocioModel');
const TokenModel = require('./src/models/tokenModel');
const ModuloDobleModel = require('./src/models/moduloDobleModel');
const IngresoAlquilerModel = require('./src/models/ingresoAlquilerModel');
const ClienteModel = require('./src/models/clienteModel');

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
const Estado = EstadoModel(sequelize, Sequelize);
const Modulo = ModuloModel(sequelize, Sequelize);
const Proyecto = ProyectoModel(sequelize, Sequelize);
const Rango = RangoModel(sequelize, Sequelize);
const UnidadNegocio = UnidadNegocioModel(sequelize, Sequelize);
const Token = TokenModel(sequelize, Sequelize);
const ModuloDoble = ModuloDobleModel(sequelize, Sequelize);
const IngresoAlquiler = IngresoAlquilerModel(sequelize, Sequelize);
const Cliente = ClienteModel(sequelize, Sequelize);

/*Conecto con la base de datos, verifico que esten los modelos creados, si no lo estan los crea 
 logging tiene que pasar a true cuando se mande a produccion */
sequelize.sync({ force: false, logging: false }).then(() => {
    //Relaciones
    Auth.belongsTo(Rango, { foreignKey: 'id_rango', targetKey: 'id_rango' });

    Rango.belongsTo(Auth, { foreignKey: 'id_rango', targetKey: 'id_rango' });

    Alquiler.belongsTo(Modulo, { foreignKey: 'id_modulo', targetKey: 'id_modulo' });
    Alquiler.belongsTo(Proyecto, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' });
    Alquiler.belongsTo(ModuloDoble, { foreignKey: 'id_modulo_doble', targetKey: 'id_modulo_doble' });
    Alquiler.hasMany(IngresoAlquiler, { foreignKey: 'id_alquiler', targetKey: 'id_alquiler' });

    Modulo.hasMany(Alquiler, { foreignKey: 'id_modulo', targetKey: 'id_modulo' });
    Modulo.hasMany(ModuloDoble, { foreignKey: 'id_modulo_uno', targetKey: 'id_modulo' });
    Modulo.hasMany(ModuloDoble, { foreignKey: 'id_modulo_dos', targetKey: 'id_modulo' });

    Proyecto.hasMany(Alquiler, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' }); 
    Proyecto.hasMany(IngresoAlquiler, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' });
    Proyecto.hasMany(Cliente, { foreignKey: 'id_cliente', targetKey: 'id_cliente' });

    ModuloDoble.belongsTo(Modulo, { as: 'moduloUno', foreignKey: 'id_modulo_uno', targetKey: 'id_modulo' });
    ModuloDoble.belongsTo(Modulo, { as: 'moduloDos', foreignKey: 'id_modulo_dos', targetKey: 'id_modulo' });
    ModuloDoble.hasMany(Alquiler, { foreignKey: 'id_modulo_doble', targetKey: 'id_modulo_doble' });

    IngresoAlquiler.belongsTo(Proyecto, { foreignKey: 'id_proyecto', targetKey: 'id_proyecto' });
    IngresoAlquiler.belongsTo(Alquiler, { foreignKey: 'id_alquiler', targetKey: 'id_alquiler' });
    
    Cliente.hasMany(Proyecto, { foreignKey: 'id_cliente', targetKey: 'id_cliente' });

    console.log('La sincronizacion con la base de datos ' + process.env.DB_NAME + ' fue un exito');
}).catch(err => {
    console.error(err)
})

module.exports = {
    Alquiler, AnalisisCosto, Auth, CentroCosto, ComprobantePago, DetalleAC, Estado, Modulo, Proyecto, Rango, UnidadNegocio, Token, 
    ModuloDoble, IngresoAlquiler, Cliente
}