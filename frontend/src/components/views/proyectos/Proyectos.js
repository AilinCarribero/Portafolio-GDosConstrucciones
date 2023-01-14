import React, { useState, useEffect, useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { Row, Col, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

//Componentes
import CentrosCostos from './CentrosCostos';
import Modulos from '../modulos/Modulos';
import Materiales from '../material/Materiales';
import ResumenContable from '../resumenContable/ResumenContable';
import ModulosDobles from '../modulos/ModulosDobles';

//Hooks
import { formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getProyectos } from '../../../redux/slice/Proyecto/thunks';

//Css
import '../../../style/Proyectos.scss';
import '../../../style/CC.scss';

//Img-Incons
//import SpinnerC from '../../utils/spinner/SpinnerC';

const Proyectos = () => {
    const { seccion } = useParams();
    const { user } = useUser();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const activeLoading = useSelector(state => state.proyectoRedux.loading);

    //console.log(proyectos, 'Loading:'+activeLoading)
    const [menu, setMenu] = useState(user.rango == "admin" || user.rango == "moderador" ? seccion || 'resumen' : 'proyectos');

    const [totales, setTotales] = useState({
        egresosHoy: 0,
        egresosFuturo: 0,
        egresos: 0,
        ingresosHoy: 0,
        ingresosFuturo: 0,
        ingresos: 0,
        egresosUSD: 0,
        egresosUSDHoy: 0,
        egresosUSDFuturo: 0,
        ingresosUSD: 0,
        ingresosUSDHoy: 0,
        ingresosUSDFuturo: 0,
        costos: 0,
        ventas: 0,
        alquiler: 0,
        alquilerHoy: 0,
        alquilerFuturo: 0,
        flujoIngresos: 0,
        flujoIngresosUSD: 0,
        flujoEgresos: 0,
        flujoEgresosUSD: 0
    });

    const [totalesUN, setTotalesUN] = useState({
        PPEgreso: 0,
        PPIngreso: 0,
        DEgreso: 0,
        DIngreso: 0,
        MEgreso: 0,
        MIngreso: 0,
        CCCIngreso: 0,
        CCCEgreso: 0,
        CCEIngreso: 0,
        CCEEgreso: 0
    })

    /*Setea y calcula el total de ventas, costos, ingresos (todo, por unidad), egresos(todo, por unidad) 
    y la diferencia entre egresos e ingresos */
    const resumenContableProyectos = () => {
        let auxTotalCosto = 0;
        let auxTotalVenta = 0;
        let auxTotalAlquiler = 0;
        let auxTotalAlquilerHoy = 0;
        let auxTotalAlquilerFuturo = 0;
        let auxTotalEgresos = 0;
        let auxTotalEgresosHoy = 0;
        let auxTotalEgresosFuturo = 0;
        let auxTotalIngresos = 0;
        let auxTotalIngresosHoy = 0;
        let auxTotalIngresosFuturo = 0;
        let auxTotalUSDE = 0;
        let auxTotalUSDEHoy = 0;
        let auxTotalUSDEFuturo = 0;
        let auxTotalUSDI = 0;
        let auxTotalUSDIHoy = 0;
        let auxTotalUSDIFuturo = 0;

        //Flujo de la caja al dia de hoy
        let auxFlujoIngresos = 0;
        let auxFlujoIngresosUSD = 0;
        let auxFlujoEgresos = 0;
        let auxFlujoEgresosUSD = 0;

        let auxPPE = 0;
        let auxPPI = 0;
        let auxDE = 0;
        let auxDI = 0;
        let auxME = 0;
        let auxMI = 0;
        let auxCCCE = 0;
        let auxCCCI = 0;
        let auxCCEE = 0;
        let auxCCEI = 0;

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

                    if (proyecto.id_unidad_negocio == '1') {
                        proyecto.egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto && egreso.id_analisis_costo != 11) {
                                auxPPE += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                                auxTotalUSDE += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                if (new Date(egreso.fecha_diferido_pago) >= new Date()) {
                                    auxTotalEgresosFuturo += parseFloat(egreso.valor_pago);
                                    auxTotalUSDEFuturo += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                    if (new Date(egreso.fecha_diferido_pago) == new Date()) {
                                        auxFlujoEgresos += parseFloat(egreso.valor_pago);
                                        auxFlujoEgresosUSD += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                    }
                                } else {
                                    auxTotalEgresosHoy += parseFloat(egreso.valor_pago);
                                    auxTotalUSDEHoy += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                }
                            }
                        });
                        proyecto.ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxPPI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                if (new Date(ingreso.fecha_diferido_cobro) >= new Date()) {
                                    auxTotalIngresosFuturo += parseFloat(ingreso.valor_cobro);
                                    auxTotalUSDIFuturo += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                    if (new Date(ingreso.fecha_diferido_cobro) == new Date()) {
                                        auxFlujoIngresos += parseFloat(ingreso.valor_cobro);
                                        auxFlujoIngresosUSD += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                    }
                                } else {
                                    auxTotalIngresosHoy += parseFloat(ingreso.valor_cobro);
                                    auxTotalUSDIHoy += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                }
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '2') {
                        proyecto.egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto && egreso.id_analisis_costo != 11) {
                                auxDE += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                                auxTotalUSDE += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                if (new Date(egreso.fecha_diferido_pago) >= new Date()) {
                                    auxTotalEgresosFuturo += parseFloat(egreso.valor_pago);
                                    auxTotalUSDEFuturo += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                    if (new Date(egreso.fecha_diferido_pago) == new Date()) {
                                        auxFlujoEgresos += parseFloat(egreso.valor_pago);
                                        auxFlujoEgresosUSD += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                    }
                                } else {
                                    auxTotalEgresosHoy += parseFloat(egreso.valor_pago);
                                    auxTotalUSDEHoy += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                }
                            }
                        });
                        proyecto.ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxDI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                if (new Date(ingreso.fecha_diferido_cobro) >= new Date()) {
                                    auxTotalIngresosFuturo += parseFloat(ingreso.valor_cobro);
                                    auxTotalUSDIFuturo += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                    if (new Date(ingreso.fecha_diferido_cobro) == new Date()) {
                                        auxFlujoIngresos += parseFloat(ingreso.valor_cobro);
                                        auxFlujoIngresosUSD += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                    }
                                } else {
                                    auxTotalIngresosHoy += parseFloat(ingreso.valor_cobro);
                                    auxTotalUSDIHoy += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                }
                            }
                        });
                    }
                    if (proyecto.id_unidad_negocio == '3') {
                        proyecto.egresos.map(egreso => {
                            if (egreso.id_proyecto == proyecto.id_proyecto && egreso.id_analisis_costo != 11) {
                                auxME += parseFloat(egreso.valor_pago);
                                auxTotalEgresos += parseFloat(egreso.valor_pago);
                                auxTotalUSDE += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                if (new Date(egreso.fecha_diferido_pago) >= new Date()) {
                                    auxTotalEgresosFuturo += parseFloat(egreso.valor_pago);
                                    auxTotalUSDEFuturo += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                    if (new Date(egreso.fecha_diferido_pago) == new Date()) {
                                        auxFlujoEgresos += parseFloat(egreso.valor_pago);
                                        auxFlujoEgresosUSD += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                    }
                                } else {
                                    auxTotalEgresosHoy += parseFloat(egreso.valor_pago);
                                    auxTotalUSDEHoy += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                }
                            }
                        });
                        proyecto.ingresos.map(ingreso => {
                            if (ingreso.id_proyecto == proyecto.id_proyecto) {
                                auxMI += parseFloat(ingreso.valor_cobro);
                                auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDI += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                if (new Date(ingreso.fecha_diferido_cobro) >= new Date()) {
                                    auxTotalIngresosFuturo += parseFloat(ingreso.valor_cobro);
                                    auxTotalUSDIFuturo += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                    if (new Date(ingreso.fecha_diferido_cobro) == new Date()) {
                                        auxFlujoIngresos += parseFloat(ingreso.valor_cobro);
                                        auxFlujoIngresosUSD += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                    }
                                } else {
                                    auxTotalIngresosHoy += parseFloat(ingreso.valor_cobro);
                                    auxTotalUSDIHoy += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                }
                            }
                        });
                    }
                } else if (proyecto.id_centro_costo == '1') {
                    proyecto.egresos.map(egreso => {
                        if (egreso.id_proyecto == proyecto.id_proyecto && egreso.id_analisis_costo != 12) {
                            /*if (egreso.analisis_costo == 'Bienes de Uso' || egreso.analisis_costo == 'Gastos de Empresa') {
                                const partesIguales = parseFloat(egreso.valor_pago) / 3;
                                auxDE += parseFloat(partesIguales);
                                auxME += parseFloat(partesIguales);
                                auxPPE += parseFloat(partesIguales);
                            } else if (egreso.analisis_costo == 'Acopio de Materiales') {
                                proyecto.id_unidad_negocio == '1' && (auxPPE += parseFloat(egreso.valor_pago));
                                proyecto.id_unidad_negocio == '2' && (auxDE += parseFloat(egreso.valor_pago));
                                proyecto.id_unidad_negocio == '3' && (auxME += parseFloat(egreso.valor_pago));
                            }*/
                            auxCCCE += parseFloat(egreso.valor_pago);
                            auxTotalEgresos += parseFloat(egreso.valor_pago);
                            auxTotalUSDE += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd)

                            if (new Date(egreso.fecha_diferido_pago) >= new Date()) {
                                auxTotalEgresosFuturo += parseFloat(egreso.valor_pago);
                                auxTotalUSDEFuturo += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                if (new Date(egreso.fecha_diferido_pago) == new Date()) {
                                    auxFlujoEgresos += parseFloat(egreso.valor_pago);
                                    auxFlujoEgresosUSD += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                }
                            } else {
                                auxTotalEgresosHoy += parseFloat(egreso.valor_pago);
                                auxTotalUSDEHoy += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                            }
                        }
                    });

                    proyecto.ingresos.map(ingreso => {
                        if (ingreso.id_proyecto == proyecto.id_proyecto) {
                            auxCCCI += parseFloat(ingreso.valor_cobro);
                            auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            auxTotalUSDI += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                            if (new Date(ingreso.fecha_diferido_cobro) >= new Date()) {
                                auxTotalIngresosFuturo += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDIFuturo += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                if (new Date(ingreso.fecha_diferido_cobro) == new Date()) {
                                    auxFlujoIngresos += parseFloat(ingreso.valor_cobro);
                                    auxFlujoIngresosUSD += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                }
                            } else {
                                auxTotalIngresosHoy += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDIHoy += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                            }
                        }
                    });
                } else if (proyecto.id_centro_costo == '3') {
                    proyecto.egresos.map(egreso => {
                        if (egreso.id_proyecto == proyecto.id_proyecto) {
                            auxCCEE += parseFloat(egreso.valor_pago)
                            auxTotalEgresos += parseFloat(egreso.valor_pago);
                            auxTotalUSDE += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd)

                            if (new Date(egreso.fecha_diferido_pago) >= new Date()) {
                                auxTotalEgresosFuturo += parseFloat(egreso.valor_pago);
                                auxTotalUSDEFuturo += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);

                                if (new Date(egreso.fecha_diferido_pago) == new Date()) {
                                    auxFlujoEgresos += parseFloat(egreso.valor_pago);
                                    auxFlujoEgresosUSD += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                                }
                            } else {
                                auxTotalEgresosHoy += parseFloat(egreso.valor_pago);
                                auxTotalUSDEHoy += !egreso.valor_usd ? 0 : parseFloat(egreso.valor_usd);
                            }
                        }
                    });

                    proyecto.ingresos.map(ingreso => {
                        if (ingreso.id_proyecto == proyecto.id_proyecto) {
                            auxCCEI += parseFloat(ingreso.valor_cobro);
                            auxTotalIngresos += parseFloat(ingreso.valor_cobro);
                            auxTotalUSDI += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                            if (new Date(ingreso.fecha_diferido_cobro) >= new Date()) {
                                auxTotalIngresosFuturo += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDIFuturo += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);

                                if (new Date(ingreso.fecha_diferido_cobro) == new Date()) {
                                    auxFlujoIngresos += parseFloat(ingreso.valor_cobro);
                                    auxFlujoIngresosUSD += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                                }
                            } else {
                                auxTotalIngresosHoy += parseFloat(ingreso.valor_cobro);
                                auxTotalUSDIHoy += !ingreso.valor_usd ? 0 : parseFloat(ingreso.valor_usd);
                            }
                        }
                    });
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
            egresos: auxTotalEgresos,
            egresosHoy: auxTotalEgresosHoy,
            egresosFuturo: auxTotalEgresosFuturo,
            ingresos: auxTotalIngresos,
            ingresosHoy: auxTotalIngresosHoy,
            ingresosFuturo: auxTotalIngresosFuturo,
            egresosUSD: auxTotalUSDE,
            egresosUSDHoy: auxTotalUSDEHoy,
            egresosUSDFuturo: auxTotalUSDEFuturo,
            ingresosUSD: auxTotalUSDI,
            ingresosUSDHoy: auxTotalUSDIHoy,
            ingresosUSDFuturo: auxTotalUSDIFuturo,
            alquiler: auxTotalAlquiler,
            alquilerHoy: auxTotalAlquilerHoy,
            alquilerFuturo: auxTotalAlquilerFuturo,
            flujoIngresos: auxFlujoIngresos,
            flujoIngresosUSD: auxFlujoIngresosUSD,
            flujoEgresos: auxFlujoEgresos,
            flujoEgresosUSD: auxFlujoEgresosUSD
        });

        setTotalesUN({
            PPEgreso: auxPPE,
            PPIngreso: auxPPI,
            DEgreso: auxDE,
            DIngreso: auxDI,
            MEgreso: auxME,
            MIngreso: auxMI,
            CCCEgreso: auxCCCE,
            CCCIngreso: auxCCCI,
            CCEEgreso: auxCCEE,
            CCEIngreso: auxCCEI,
        })
    }

    //Si existe alguna modificacion en los proyectos se debe recalcular todos
    useEffect(() => {
        resumenContableProyectos();
    }, [proyectos]);

    const handleButton = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        //console.log(targetName, targetValue, targetCheck);
        setMenu(targetName);
        navigate(`/menu/${targetName}`)
    }

    return (<>
        <div>
            <Row className="menu-inicio">
                {(user.rango == "admin" || user.rango == "moderador") && <>
                    <Col>
                        <button className={menu == 'resumen' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="resumen">Resumen</button>
                    </Col>
                    {/* <Col>
                        <button className={menu == 'ccc-cce' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="ccc-cce">CCC y CCE</button>
                    </Col>*/}
                </>}
                <Col>
                    <button className={menu == 'proyectos' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="proyectos">Proyectos</button>
                </Col>
                <Col>
                    <button className={menu == 'alquileres' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="alquileres">Alquileres</button>
                </Col>
                {user.rango == 'admin' && <>
                    <Col>
                        <button className={menu == 'modulos' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos">Módulos</button>
                    </Col>
                    <Col>
                        <button className={menu == 'modulos-dobles' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos-dobles">Módulos Dobles</button>
                    </Col>
                </>}
                {/*<Col>
                    <button className={menu == 'materiales' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="materiales">Materiales</button>
                </Col>*/}
            </Row>
            <Row className="content-data">
                {
                    /*Si no es resumen ni modulo ni materiales es centro de costo. Si no es modulo es materiales. Si es modulo*/
                    menu != 'resumen' ?
                        menu != 'modulos' ?
                            menu != 'modulos-dobles' ?
                                <CentrosCostos proyectos={proyectos} setProyectos={'dispatch(getProyectos())'} mostrar={menu} />
                                : <ModulosDobles />
                            : <Modulos />
                        : (user.rango == "admin" || user.rango == "moderador") &&
                        <ResumenContable Totales={totales} />
                }
            </Row>
        </div >
    </>)
}

export default React.memo(Proyectos);
