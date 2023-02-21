import React, { useState } from 'react';
import { Accordion, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import FormContrato from '../alquiler/FormContrato';

//Hooks
import { calcDifDias, formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';
import { useGetAlquileresId } from '../../../hooks/useAlquileres';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const AccordionCentrosCostos = ({ proyecto, setProyectos }) => {
    const { user } = useUser();
    const { setAlquileres } = useGetAlquileresId();

    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [showModalFormContrato, setShowModalFormContrato] = useState(false);

    const [actionContrato, setActionContrato] = useState();
    const [idProyecto, setIdProyecto] = useState();

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

    const modalFormContrato = (action, id) => {
        setShowModalFormContrato(true);
        setIdProyecto(id)
        setActionContrato(action);
    }

    return (<>
        {showFormUpdate && <ModalFormulario formulario={'proyecto'} informacion={proyecto} show={showFormUpdate} setShow={setShowFormUpdate} updateNew={setProyectos} />}
        {showModalFormContrato && <FormContrato idProyecto={idProyecto} show={showModalFormContrato} setShow={setShowModalFormContrato} setAlquileres={setAlquileres} actionContrato={actionContrato} />}

        <Accordion.Item eventKey={proyecto.id_proyecto} className={proyecto.id_centro_costo == 1 || proyecto.id_centro_costo == 3 ? 'accordionCC' : 'content-accordion'}>
            <Accordion.Header>
                {/*Estados: 1.Por Empezar 2.En proceso 3.Finalizado */}
                {proyecto.id_estado == 1 &&
                    <OverlayTrigger placement="right" overlay={<Tooltip>Pendiente.</Tooltip>} >
                        <Col xs={1} md={1} className="state-pendiente" > <Icons.ConeStriped size={19} className='state-icon' /></Col>
                    </OverlayTrigger>
                }
                {proyecto.id_estado == 2 &&
                    <OverlayTrigger placement="right" overlay={<Tooltip>En proceso.</Tooltip>} >
                        <Col xs={1} md={1} className="state-proceso" > <Icons.Tools size={17} className='state-icon' /> </Col>
                    </OverlayTrigger>
                }
                {proyecto.id_estado == 3 &&
                    <OverlayTrigger placement="right" overlay={<Tooltip>Finalizado.</Tooltip>} >
                        <Col xs={1} md={1} className="state-finish" > <Icons.HouseDoorFill size={19} className='state-icon' /> </Col>
                    </OverlayTrigger>
                }

                <Col xs={5} md={5}>{proyecto.id_proyecto}</Col>
                {proyecto.fecha_f_proyecto && calcDifDias(new Date(), proyecto.fecha_f_proyecto) > 0 && 
                    <Col xs={2} md={2} className={calcDifDias(new Date(), proyecto.fecha_f_proyecto) <= 15 ? "text-for-finish" : ""} >
                        Dias restantes: {calcDifDias(new Date(), proyecto.fecha_f_proyecto)}
                    </Col>
                }
                {/*(user.rango == "admin" || user.rango == "moderador") && !proyecto.id_proyecto.includes('CCC') && !proyecto.id_proyecto.includes('CCE') &&
                        <Col xs={4} md={3}> Resto: ${formatNumber(ingresosProyecto(proyecto.ingresos) - egresosProyecto(proyecto.egresos))} / USD${formatNumber(ingresosUSDProyecto(proyecto.ingresos) - egresosUSDProyecto(proyecto.egresos))}</Col>
                    */}
            </Accordion.Header>
            <Accordion.Body>
                <Row>
                    {proyecto.id_centro_costo == 2 && (user.rango == "admin") && <>
                        {proyecto.venta > 0 && <Col xs={12} md={6}>
                            <Row>
                                <Col xs={1} md={1}></Col>
                                <Col xs={11} md={11}><p> Venta: ${formatNumber(proyecto.venta)}</p></Col>
                            </Row>
                        </Col>}
                        {proyecto.costo > 0 &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}></Col>
                                    <Col xs={11} md={11}><p> Costo: ${formatNumber(proyecto.costo)}</p></Col>
                                </Row>
                            </Col>
                        }
                        {proyecto.alquiler_total > 0 && (user.rango == "admin") &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}>
                                        {proyecto.alquilers.length > 0 && <Link to={`/alquileres/${proyecto.id_proyecto}`}> <Icons.BoxArrowInRight className="icon-detalle" /> </Link>}
                                    </Col>
                                    <Col xs={11} md={11}><p> Total por Alquileres: ${formatNumber(proyecto.alquiler_total)}</p></Col>
                                </Row>
                            </Col>
                        }
                    </>}
                </Row>
                <Row>
                    {/*<Col xs={12} md={6}>
                            <Row>
                                <Col xs={1} md={1}>
                                    <Link to={`/egresos/${proyecto.id_proyecto}`}> <Icons.BoxArrowInRight className="icon-detalle" /> </Link>
                                </Col>
                                <Col xs={11} md={11}><p> Egresos:</p>
                                    <Col xs={6} md={6}><p>${formatNumber(egresosProyecto(proyecto.egresos))} </p></Col>
                                    <Col xs={5} md={5}><p>USD${formatNumber(egresosUSDProyecto(proyecto.egresos))} </p></Col>
                                </Col>
                            </Row>
                        </Col>
                        {(user.rango == "admin" || user.rango == "moderador") &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}>
                                        <Link to={`/ingresos/${proyecto.id_proyecto}`}> <Icons.BoxArrowInRight className="icon-detalle" /> </Link>
                                    </Col>
                                    <Col xs={11} md={11}><p> Ingresos:</p>
                                        <Col xs={6} md={6}><p>${formatNumber(ingresosProyecto(proyecto.ingresos))} </p></Col>
                                        <Col xs={5} md={5}><p>USD${formatNumber(ingresosUSDProyecto(proyecto.ingresos))} </p></Col>
                                    </Col>
                                </Row>
                            </Col>
                        }*/}
                    {user.rango == "admin" && proyecto.fecha_i_proyecto && <>
                        <Col xs={12} md={6}>
                            <Row>
                                <Col xs={1} md={1}></Col>
                                <Col xs={11} md={11}><p> Fecha de inicio: {formatFecha(proyecto.fecha_i_proyecto)}</p> </Col>
                            </Row>
                        </Col>
                        {proyecto.fecha_f_proyecto && (new Date(proyecto.fecha_f_proyecto).toISOString().slice(0, 10) != new Date('2200-01-01').toISOString().slice(0, 10)) &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}></Col>
                                    <Col xs={11} md={11}><p> Fecha de finalizacion: {formatFecha(proyecto.fecha_f_proyecto)}</p> </Col>
                                </Row>
                            </Col>
                        }
                    </>}
                </Row>
                {user.rango == 'admin' &&
                    <Row className="border-top">
                        <Col xs={12} md={12}>
                            <p className="accordion-title-section">Acciones</p>
                        </Col>
                        <Col xs={12} md={3}>
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
                        <Col xs={12} md={3}>
                            <button className="button-action" onClick={() => modalFormContrato('Nuevo', proyecto.id_proyecto)}>
                                <Row>
                                    <Col xs={1} md={1} className='icon-action'>
                                        <Icons.PencilSquare size={19} />
                                    </Col>
                                    <Col xs={10} md={10} className='text-action'>
                                        Agregar alquiler
                                    </Col>
                                </Row>
                            </button>
                        </Col>
                    </Row>
                }
            </Accordion.Body>
        </Accordion.Item>
    </>)
}

export default React.memo(AccordionCentrosCostos);