import React, { useState, useEffect, useContext } from 'react';
import { Accordion, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Hooks
import { formatNumber } from '../../../hooks/useUtils';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const CentrosCostos = ({ proyectos, mostrar }) => {
    const [proyectosMostrar, setProyectosMostrar] = useState([]);

    useEffect(() => {
        if (proyectos) {
            setProyectosMostrar(
                proyectos.filter(proyecto => {
                    if (mostrar == 'proyectos' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total <= 0) {
                        return proyecto
                    } else if (mostrar == 'alquileres' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total > 0) {
                        return proyecto
                    } else if (mostrar == 'ccc-cce' && (proyecto.id_proyecto.includes('CCC') || proyecto.id_proyecto.includes('CCE'))) {
                        return proyecto
                    }
                })
            );
        }
    }, [proyectos, mostrar]);

    //Egresos totales de un proyecto determinado
    const egresosProyecto = (PEgresos) => {
        let auxEgresosProyecto = 0;

        PEgresos.map(egreso => {
            auxEgresosProyecto += parseFloat(egreso.valor_pago);
        })

        return (auxEgresosProyecto)
    }

    //Egresos totales de un proyecto determinado en dolares
    const egresosUSDProyecto = (PUSDEgresos) => {
        let auxEgresosProyecto = 0;

        PUSDEgresos.map(egreso => {
            auxEgresosProyecto += parseFloat(egreso.valor_usd);
        })

        return (auxEgresosProyecto)
    }

    //Ingresos totales de un proyecto determinado
    const ingresosProyecto = (PIngresos) => {
        let auxIngresosProyecto = 0;

        PIngresos.map(ingreso => {
            auxIngresosProyecto += parseFloat(ingreso.valor_cobro);
        })

        return (auxIngresosProyecto)
    }

    //Ingresos totales de un proyecto determinado en dolares
    const ingresosUSDProyecto = (PUSDIngresos) => {
        let auxIngresosProyecto = 0;

        PUSDIngresos.map(ingreso => {
            auxIngresosProyecto += parseFloat(ingreso.valor_usd);
        })

        return (auxIngresosProyecto)
    }

    return (<>
        <Accordion>
            {
                proyectosMostrar &&
                proyectosMostrar.map(proyecto => (
                    <Col key={proyecto.id_proyecto} >
                        <Accordion.Item eventKey={proyecto.id_proyecto} className={proyecto.id_centro_costo == 1 || proyecto.id_centro_costo == 3 ? 'accordionCC' : ''}>
                            <Accordion.Header> {proyecto.id_proyecto} </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    {proyecto.id_centro_costo == 2 && <>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Venta: ${formatNumber(proyecto.venta)}</p></Col>
                                            </Row>
                                        </Col>
                                        {proyecto.costo > 0 &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Costo: ${formatNumber(proyecto.costo)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        {proyecto.alquiler_total > 0 &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}>
                                                        <Link to={`/alquileres/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                                    </Col>
                                                    <Col xs={11} md={11}><p> Total por Alquileres: ${formatNumber(proyecto.alquiler_total)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                    </>}
                                </Row>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <Row>
                                            <Col xs={1} md={1}>
                                                <Link to={`/egresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                            </Col>
                                            <Col xs={11} md={11}><p> Egresos:</p>
                                                <Col xs={6} md={6}><p>${formatNumber(egresosProyecto(proyecto.egresos))} </p></Col>
                                                <Col xs={5} md={5}><p>USD${formatNumber(egresosUSDProyecto(proyecto.egresos))} </p></Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Row>
                                            <Col xs={1} md={1}>
                                                <Link to={`/ingresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                            </Col>
                                            <Col xs={11} md={11}><p> Ingresos:</p>
                                                <Col xs={6} md={6}><p>${formatNumber(ingresosProyecto(proyecto.ingresos))} </p></Col>
                                                <Col xs={5} md={5}><p>USD${formatNumber(ingresosUSDProyecto(proyecto.ingresos))} </p></Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Col>
                ))
            }
        </Accordion>
    </>)
}

export default React.memo(CentrosCostos);