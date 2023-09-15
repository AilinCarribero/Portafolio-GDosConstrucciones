import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

//Componentes
import CentrosCostos from './CentrosCostos';
import Modulos from '../modulos/Modulos';
import ResumenContable from '../resumenContable/ResumenContable';
import ModulosDobles from '../modulos/ModulosDobles';

//Hooks
import { useUser } from '../../../hooks/useUser';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { setMenu } from '../../../redux/slice/Proyecto/proyectoSlice';

//Css
import '../../../style/Proyectos.scss';
import '../../../style/CC.scss';

const Proyectos = () => {
    const { seccion } = useParams();
    const { user } = useUser();

    const dispatch = useDispatch();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const menu = useSelector(state => state.proyectoRedux.menu);

    const [totales, setTotales] = useState({
        costos: 0,
        ventas: 0,
        alquiler: 0,
        alquilerHoy: 0,
        alquilerFuturo: 0,
    });

    /*Setea y calcula el total de ventas, costos, ingresos (todo, por unidad), egresos(todo, por unidad) 
    y la diferencia entre egresos e ingresos */
    const resumenContableProyectos = () => {
        let auxTotalCosto = 0;
        let auxTotalVenta = 0;
        let auxTotalAlquiler = 0;
        let auxTotalAlquilerHoy = 0;
        let auxTotalAlquilerFuturo = 0;

        //Reparte los ingresos y los egresos correspondientes a cada area
        if (proyectos && proyectos.length > 0) {
            proyectos.map(proyecto => {
                if (proyecto.id_centro_costo == '2') {
                    auxTotalCosto += parseFloat(proyecto.costo);
                    auxTotalVenta += parseFloat(proyecto.venta);
                    auxTotalAlquiler += parseFloat(proyecto.alquiler_total ? proyecto.alquiler_total : 0);

                    if (proyecto.alquilers.length > 0) {
                        proyecto.alquilers.map(alquiler => {
                            if (new Date(alquiler.fecha_h_alquiler) >= new Date()) {
                                auxTotalAlquilerFuturo += parseFloat(alquiler.valor);
                            } else {
                                auxTotalAlquilerHoy += parseFloat(alquiler.valor);
                            }
                        })
                    }
                } 
            })
        } else {
            if (proyectos) {
                auxTotalCosto = proyectos.costo || 0;
                auxTotalVenta = proyectos.venta || 0;
                auxTotalAlquiler = proyectos.alquiler_total || 0;
            } else {
                auxTotalCosto = 0;
                auxTotalVenta = 0;
                auxTotalAlquiler = 0;
            }
        }

        setTotales({
            costos: auxTotalCosto,
            ventas: auxTotalVenta,
            alquiler: auxTotalAlquiler,
            alquilerHoy: auxTotalAlquilerHoy,
            alquilerFuturo: auxTotalAlquilerFuturo,
        });

    }

    //Si existe alguna modificacion en los proyectos se debe recalcular todos
    useEffect(() => {
        resumenContableProyectos();
    }, [proyectos]);

    useEffect(() => {
        dispatch(setMenu(user.rango === "admin" ? seccion || 'resumen' : (user.rango === 'taller' ? seccion || 'modulos' : seccion || 'alquileres') ))
    }, [])

    return (<>
        <div>
            <Row className="content-data">
                {
                    /*Si no es resumen ni modulo ni materiales es centro de costo. Si no es modulo es materiales. Si es modulo*/
                    menu != 'resumen' ?
                        menu != 'modulos' ?
                            menu != 'modulos-dobles' ?
                                <CentrosCostos proyectos={proyectos} setProyectos={'dispatch(getProyectos())'} mostrar={menu} />
                                : <ModulosDobles />
                            : <Modulos />
                        : user.rango == "admin" ?
                            <ResumenContable Totales={totales} /> : <CentrosCostos proyectos={proyectos} setProyectos={'dispatch(getProyectos())'} mostrar={menu} />
                }
            </Row>
        </div >
    </>)
}

export default React.memo(Proyectos);
