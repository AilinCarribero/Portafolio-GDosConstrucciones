import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const AccordionCentrosCostos = ({ proyecto, setProyectos }) => {
    const { user } = useUser();

    const [showFormUpdate, setShowFormUpdate] = useState(false);

    const updateProyecto = () => {
        setShowFormUpdate(true);
    }

    //Egresos totales de un proyecto determinado
    const egresosProyecto = (PEgresos) => {
        let auxEgresosProyecto = 0;

        if (PEgresos) {
            PEgresos.map(egreso => {
                auxEgresosProyecto += egreso.valor_pago ? parseFloat(egreso.valor_pago) : 0;
            })
        }
        return (auxEgresosProyecto)
    }

    //Egresos totales de un proyecto determinado en dolares
    const egresosUSDProyecto = (PUSDEgresos) => {
        let auxEgresosProyecto = 0;

        if (PUSDEgresos) {
            PUSDEgresos.map(egreso => {
                auxEgresosProyecto += egreso.valor_usd ? parseFloat(egreso.valor_usd) : 0;
            })
        }
        return (auxEgresosProyecto)
    }

    //Ingresos totales de un proyecto determinado
    const ingresosProyecto = (PIngresos) => {
        let auxIngresosProyecto = 0;

        if (PIngresos) {
            PIngresos.map(ingreso => {
                auxIngresosProyecto += ingreso.valor_cobro ? parseFloat(ingreso.valor_cobro) : 0;
            })
        }
        return (auxIngresosProyecto)
    }

    //Ingresos totales de un proyecto determinado en dolares
    const ingresosUSDProyecto = (PUSDIngresos) => {
        let auxIngresosProyecto = 0;

        if (PUSDIngresos) {
            PUSDIngresos.map(ingreso => {
                auxIngresosProyecto += ingreso.valor_usd ? parseFloat(ingreso.valor_usd) : 0;
            })
        }
        return (auxIngresosProyecto)
    }

    return (<>
        <Col >
            {showFormUpdate && <ModalFormulario formulario={'proyecto'} informacion={proyecto} show={showFormUpdate} setShow={setShowFormUpdate} updateNew={setProyectos} />}

            <Accordion.Item eventKey={proyecto.id_proyecto} className={proyecto.id_centro_costo == 1 || proyecto.id_centro_costo == 3 ? 'accordionCC' : ''}>
                <Accordion.Header>
                    <Col xs={12} md={5}>{proyecto.id_proyecto}</Col>
                    <Col xs={4} md={4}> Resto: ${formatNumber(ingresosProyecto(proyecto.ingresos) - egresosProyecto(proyecto.egresos))} / USD${formatNumber(ingresosUSDProyecto(proyecto.ingresos) - egresosUSDProyecto(proyecto.egresos))}</Col>
                </Accordion.Header>
                <Accordion.Body>
                    <Row>
                        {proyecto.id_centro_costo == 2 && user.rango != 'usuario comun' && <>
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
                        {user.rango != "usuario comun" &&
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
                        }
                        {user.rango == "admin" &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}></Col>
                                    <Col xs={11} md={11}><p> Fecha de inicio: {formatFecha(proyecto.fecha_i_proyecto)}</p> </Col>
                                </Row>
                            </Col>
                        }
                        {user.rango == "admin" && proyecto.fecha_f_proyecto && new Date(proyecto.fecha_f_proyecto) > new Date(proyecto.fecha_i_proyecto) &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}></Col>
                                    <Col xs={11} md={11}><p> Fecha de finalizacion: {formatFecha(proyecto.fecha_f_proyecto)}</p> </Col>
                                </Row>
                            </Col>
                        }
                    </Row>
                    {user.rango == 'admin' &&
                        <Row className="border-top">
                            <Col xs={12} md={12}>
                                <p className="title-actions">Acciones</p>
                            </Col>
                            <Col xs={6} md={6}>
                                <button className="button-action" onClick={() => updateProyecto()}>
                                    <Row>
                                        <Col xs={1} md={1} className='icon-action'>
                                            <Icons.PencilSquare size={19} />
                                        </Col>
                                        <Col xs={10} md={10} className='text-action'>
                                            Modificar
                                        </Col>
                                    </Row>
                                </button>
                            </Col>
                        </Row>
                    }
                </Accordion.Body>
            </Accordion.Item>
        </Col>
    </>)
}

export default React.memo(AccordionCentrosCostos);