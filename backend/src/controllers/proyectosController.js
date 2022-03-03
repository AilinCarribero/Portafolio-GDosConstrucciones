const { CentroCosto, UnidadNegocio, Alquiler, Proyecto, Modulo, Egreso, Ingreso } = require('../../db');

//listar todos los proyectos existentes
exports.listProyectos = (req, res) => {
    Proyecto.findAll({
        include: [{
            model: Alquiler,
            include: [{
                model: Modulo
            }]
        },{
            model: Egreso
        },{
            model: Ingreso
        }]
    }).then( response => {
        res.json(response);
    }).catch( error => {
        res.json(error);
    });
}

//Insertar un proyecto nuevo
exports.insertProyecto = async (req, res) => {
    let id_proyecto = '';
    const countAlquileres = req.body.alquileres ? (req.body.alquileres).length : '';

    if (!req.body.costo) {
        req.body.costo = 0;
    }
    if (!req.body.venta) {
        req.body.venta = 0;
    }
    if (!req.body.alquiler_total) {
        req.body.venta = 0;
    }
    if(!req.body.fecha_f_proyecto){
        req.body.fecha_f_proyecto='1000-01-01';
    }

    try {
        const centro_costo = req.body.id_centro_costo ? await CentroCosto.findAll({
            where: {
                id_centro_costo: req.body.id_centro_costo
            },
            raw: true
        }) : '';

        const unidad_negocio = req.body.id_unidad_negocio ? await UnidadNegocio.findAll({
            where: {
                id_unidad_negocio: req.body.id_unidad_negocio
            },
            raw: true
        }) : '';

        if (centro_costo[0].siglas_cc) {
            id_proyecto = centro_costo[0].siglas_cc;

            if (unidad_negocio[0].siglas_uc) {
                id_proyecto = id_proyecto + '-' + unidad_negocio[0].siglas_uc;

                if (req.body.cliente) {
                    id_proyecto = id_proyecto + '-' + req.body.cliente
                }
            }
        } else {
            return res.json('No se encontro el centro de costos');
        }

        req.body.id_proyecto= id_proyecto;

        Proyecto.create(req.body).then(result => {
            req.body.alquileres.forEach((alquiler,i) => {
                alquiler.id_proyecto = id_proyecto;

                //Una vez guardado el proyecto guardamos los alquileres relacionados con el proyecto
                Alquiler.create(alquiler).then(result => {
                    /*Si el alquiler se guardo como corresponde el estado del modulo correspondiente al alquiler pasa a tener 
                    un estado de ocupado*/
                    Modulo.update({ estado: 1 }, {
                        where: {
                          id_modulo: alquiler.id_modulo
                        }
                    }).then( result => {
                        /*Si hasta aqui no hay errores se fija si es el ultimo alquiler que se guardo. De ser asi responde que todo
                        esta bien */
                        if(i==(countAlquileres-1)){
                            result.todoOk = "Ok";
                            res.json(result);
                        }
                    }).catch(error => {
                        console.error(error);
                        return res.json(error);
                    });
                }).catch(error => {
                    console.error(error);
                    return res.json(error);
                });
            });
        }).catch(error => {
            console.error(error);
            return res.json(error);
        });
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
}
