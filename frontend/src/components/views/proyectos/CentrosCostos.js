import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Decimal from 'decimal.js-light';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import AccordionCentroCosto from "./AccordionCentroCosto";

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';
import { useGetProyectos } from '../../../hooks/useProyectos';

const CentrosCostos = ({ proyectos, mostrar, setProyectos }) => {
    const { user } = useUser();

    const [proyectosMostrar, setProyectosMostrar] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formulario, setFormulario] = useState();

    const [totales, setTotales] = useState({
        egresos: 0,
        egresosUSD: 0,
        ingresos: 0,
        ingresosUSD: 0,
    })

    useEffect(() => {
        let auxEgresos, auxEgresosUSD, auxIngresos, auxIngresosUSD;

        if (proyectos) {
            setProyectosMostrar(
                proyectos.filter((proyecto, i) => {
                    if (i == 0) {
                        auxEgresos = new Decimal(0);
                        auxEgresosUSD = new Decimal(0);
                        auxIngresos = new Decimal(0);
                        auxIngresosUSD = new Decimal(0);
                    }

                    if (mostrar == 'proyectos' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total <= 0) {
                        proyecto.egresos.map(egreso => {
                            if (egreso.valor_usd) {
                                auxEgresosUSD = auxEgresosUSD.add(egreso.valor_usd);
                            } else {
                                auxEgresos = auxEgresos.add(egreso.valor_pago);
                            }
                        });

                        proyecto.ingresos.map(ingreso => {
                            if (ingreso.valor_usd) {
                                auxIngresosUSD = auxIngresosUSD.add(ingreso.valor_usd);
                            } else {
                                auxIngresos = auxIngresos.add(ingreso.valor_cobro);
                            }
                        });

                        setTotales({
                            egresos: auxEgresos,
                            egresosUSD: auxEgresosUSD,
                            ingresos: auxIngresos,
                            ingresosUSD: auxIngresosUSD
                        });

                        return proyecto
                    } else if (mostrar == 'alquileres' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total > 0) {
                        proyecto.egresos.map(egreso => {
                            if (egreso.valor_usd) {
                                auxEgresosUSD = auxEgresosUSD.add(egreso.valor_usd);
                            } else {
                                auxEgresos = auxEgresos.add(egreso.valor_pago);
                            }
                        });

                        proyecto.ingresos.map(ingreso => {
                            if (ingreso.valor_usd) {
                                auxIngresosUSD = auxIngresosUSD.add(ingreso.valor_usd);
                            } else {
                                auxIngresos = auxIngresos.add(ingreso.valor_cobro);
                            }
                        });

                        setTotales({
                            egresos: auxEgresos,
                            egresosUSD: auxEgresosUSD,
                            ingresos: auxIngresos,
                            ingresosUSD: auxIngresosUSD
                        });

                        return proyecto
                    } else if (mostrar == 'ccc-cce' && (proyecto.id_proyecto.includes('CCC') || proyecto.id_proyecto.includes('CCE'))) {
                        proyecto.egresos.map(egreso => {
                            if (egreso.valor_usd) {
                                auxEgresosUSD = auxEgresosUSD.add(egreso.valor_usd);
                            } else {
                                auxEgresos = auxEgresos.add(egreso.valor_pago);
                            }
                        });

                        proyecto.ingresos.map(ingreso => {
                            if (ingreso.valor_usd) {
                                auxIngresosUSD = auxIngresosUSD.add(ingreso.valor_usd);
                            } else {
                                auxIngresos = auxIngresos.add(ingreso.valor_cobro);
                            }
                        });

                        setTotales({
                            egresos: auxEgresos,
                            egresosUSD: auxEgresosUSD,
                            ingresos: auxIngresos,
                            ingresosUSD: auxIngresosUSD
                        });

                        return proyecto
                    }
                })
            );
        }
    }, [proyectos, mostrar]);

    //Que formulario abrir
    const setShowFormSelccion = (form) => {
        setFormulario(form)
        setShowForm(!showForm);
    }

    return (<>
        <ModalFormulario formulario={formulario} show={showForm} setShow={setShowForm} updateNew={formulario == 'proyecto' && setProyectos} />

        <Row className='content-resumen'>
            <Col xs={12} md={user.rango != "usuario comun" ? 6 : 12}>
                <Row className="conten-buttons-agregar">
                    <Col xs={6} sm={6} md={4}>
                        <button className="button-agregar" onClick={() => setShowFormSelccion('egreso')} variant="dark" >
                            <Icons.Plus className="icon-button" size={19} /> Egreso
                        </button>
                    </Col>
                    {user.rango != "usuario comun" && <>
                        <Col xs={6} sm={6} md={4}>
                            <button className="button-agregar" onClick={() => setShowFormSelccion('ingreso')} variant="dark" >
                                <Icons.Plus className="icon-button" size={19} /> Ingreso
                            </button>
                        </Col>
                        {user.rango == 'admin' &&
                            <Col xs={6} sm={6} md={4}>
                                <button className="button-agregar" onClick={() => setShowFormSelccion('proyecto')} variant="dark">
                                    <Icons.Plus className="icon-button" size={19} /> Proyecto
                                </button>
                            </Col>
                        }
                    </>}
                </Row>
            </Col>
            {user.rango != "usuario comun" &&
                <Col xs={12} md={6}>
                    <Row>
                        <Col xs={6} md={6} className='content-section'> Ingresos: {totales.ingresos ? formatNumber(totales.ingresos) : 0} </Col>
                        <Col xs={6} md={6} className='content-section'> Egresos: {totales.egresos ? formatNumber(totales.egresos) : 0}</Col>
                    </Row>
                </Col>
            }
        </Row>

        <Accordion>
            {
                proyectosMostrar &&
                proyectosMostrar.map(proyecto => (
                    <AccordionCentroCosto key={proyecto.id_proyecto} proyecto={proyecto} setProyectos={setProyectos} />
                ))
            }
        </Accordion>
    </>)
}

export default React.memo(CentrosCostos);