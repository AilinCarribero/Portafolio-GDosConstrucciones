const cron = require('node-cron');

//Importacion de Jobs
const { estadoModulos } = require('./src/jobs/ModuloJobs');
const { estadoProyectos } = require('./src/jobs/ProyectosJobs');
const { createToken } = require('./src/jobs/TokenJobs');

/* Significado de los asteriscos: 1.(Opcional)segundos 2.Minutos 3.Horas 4.Dias del mes 5.Meses 6.Dias de la semana */
/* Para pruebas usar al configuracion '30 * * * * *' */
/*cron.schedule('30 * * * * *', () => {
    estadoProyectos();
    estadoModulos();
})*/

//Tareas programadas a realizar a diario '00 00 * * *'
cron.schedule('00 00 * * *', () => {
    estadoProyectos();
    estadoModulos();
});

cron.schedule('* * * * * 01', () => {
    createToken();
})