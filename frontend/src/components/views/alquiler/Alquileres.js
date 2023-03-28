import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col, ModalBody, Spinner, OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
import Decimal from 'decimal.js-light';
import moment from 'moment';

//Redux
import { useSelector } from 'react-redux';

//Components
import FormContrato from './FormContrato';
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

//Hooks
import { calcCantMeses, formatFecha, formatNameMes, formatNumber, formatTextMix } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';
import { useAlquileres, useGetAlquileresId } from '../../../hooks/useAlquileres';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import '../../../style/Alquiler.scss';
import GraficIngresosAlquileres from '../ingresosAlquiler/GraficIngresosAlquileres';

const Alquileres = () => {
    const mesActual = formatNameMes(moment().month());
    const mesAnterior = formatNameMes(moment().month() - 1);
    const mesPosterior = formatNameMes(moment().month() + 1);

    const { id } = useParams();
    const { user } = useUser();
    const { ingresoAlquilerXMes, yearHere, monthHere } = useAlquileres();
    const { CalcMesesAlquiler, setAlquileres } = useGetAlquileresId(id);

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const loadingProyectos = useSelector(state => state.proyectoRedux.loading);

    const [proyecto, setProyecto] = useState(proyectos.find(proyecto => proyecto.id_proyecto.trim() === id.trim()));

    const [renovarAlquiler, setRenovarAlquiler] = useState([]);
    const [actionContrato, setActionContrato] = useState();
    //console.log(alquileres, mesAlquiler, totalAlquiler);
    const [showModalFormContrato, setShowModalFormContrato] = useState(false);
    const [showModalFormIngresoAlquiler, setShowModalFormIngresoAlquiler] = useState(false);

    useEffect(() => {
        setProyecto(proyectos.find(proyecto => proyecto.id_proyecto.trim() === id.trim()));
    }, [proyectos])

    const modalFormContrato = (action, alquiler) => {
        setShowModalFormContrato(true);
        setRenovarAlquiler(alquiler);
        setActionContrato(action);
    }

    const determinarDeuda = (desde, hasta, ingresos) => {
        const here = moment(new Date());

        let estado = '';
        let pagado = true;

        const desdeAM = moment(desde).format("YYYY-MM");
        const hastaAM = moment(hasta).format("YYYY-MM");

        const cantMeses = calcCantMeses(desde, hasta);

        let arrayMesesAlquiler = [];

        const d = moment(desdeAM);

        for(let i = 0; i < cantMeses; i++) {
            arrayMesesAlquiler[i] = {
                mes: d.format("YYYY-MM"),
                pagado: false
            };

            d.add(1, 'months');
        }

        ingresos.forEach(ingreso => {
            const cantMesesIngreso = calcCantMeses(ingreso.fecha_desde_cobro, ingreso.fecha_hasta_cobro);

            const dI = moment(ingreso.fecha_desde_cobro);

            for(let i = 0; i < cantMesesIngreso; i++) {
                arrayMesesAlquiler.forEach((alquiler, index) => {
                    if(alquiler.mes == dI.format("YYYY-MM")) {
                        arrayMesesAlquiler[index].pagado = true;
                    }
                })

                dI.add(1, 'months');
            }
        });

        /*
        Pagado alquiler.pagado && hoy > hastaAM
        Cancelado alquiler.pagado && hoy < hastaAM
        Debiendo !alquiler.pagado && hoy > hastaAM
        Pendientes !alquiler.pagado && hoy < hastaAM
        */
        arrayMesesAlquiler.forEach(alquiler => {
            if(!alquiler.pagado) {
                pagado = false;
            }
        });

        if(!pagado) {
            if(here.format("YYYY-MM") <= hastaAM) {
                estado = <OverlayTrigger placement="bottom" overlay={<Tooltip>Pendiente de Pago.</Tooltip>} ><Col xs={2} md={2} id="pago-pendiente"><Icons.Cash size={15} className='state-icon' /></Col></OverlayTrigger>;
            } else {
                estado = <OverlayTrigger placement="bottom" overlay={<Tooltip>Debiendo.</Tooltip>} ><Col xs={2} md={2} id="pago-debiendo"><Icons.Cash size={15} className='state-icon' /></Col></OverlayTrigger>;
            }
        } else {
            if(here.format("YYYY-MM") <= hastaAM) {
                estado = <OverlayTrigger placement="bottom" overlay={<Tooltip>Cancelado.</Tooltip>} ><Col xs={2} md={2} id="pago-cancelado"><Icons.Cash size={15} className='state-icon' /></Col></OverlayTrigger>;
            } else {
                estado = <OverlayTrigger placement="bottom" overlay={<Tooltip>Pagado.</Tooltip>} ><Col xs={2} md={2} id="pago-pagado"><Icons.Cash size={15} className='state-icon' /></Col></OverlayTrigger>;
            }
        }

        return estado;
    }
    
    return (<>
        <ModalFormulario formulario={'ingresoAlquiler'} show={showModalFormIngresoAlquiler} informacion={proyecto} setShow={setShowModalFormIngresoAlquiler} />
        {showModalFormContrato && <FormContrato alquiler={renovarAlquiler} show={showModalFormContrato} setShow={setShowModalFormContrato} setAlquileres={setAlquileres} actionContrato={actionContrato} />}

        <Row>
            <Col xs={12} md={8} className="titulo-alquileres-vista">{id}</Col>
            <Row className='content-resumen-alquileres'>
                {(user.rango === 'moderador') &&
                    <Col md={3}>
                        <button className="button-agregar" onClick={() => setShowModalFormIngresoAlquiler(true)} variant="dark">
                            <Icons.Plus className="icon-button" size={19} /> Ingreso a un Alquiler
                        </button>
                    </Col>
                }
                {user.rango === 'admin' &&
                    <>
                        <Col>
                            <button className="button-agregar" onClick={() => modalFormContrato('Nuevo')} variant="dark">
                                <Icons.Plus className="icon-button" size={19} /> Agregar Contrato
                            </button>
                        </Col>
                        <Col>
                            <button className="button-agregar" onClick={() => setShowModalFormIngresoAlquiler(true)} variant="dark">
                                <Icons.Plus className="icon-button" size={19} /> Ingreso a un Alquiler
                            </button>
                        </Col>
                        <Col className='text-resumen-alquileres'><b>Total:</b> {loadingProyectos ? <Spinner animation="border" variant="dark" size='sm' /> : proyecto && `$${formatNumber(proyecto.totalAlquiler)}`}</Col>
                        <Col className='text-resumen-alquileres'><b>{formatTextMix(mesAnterior)}:</b> {loadingProyectos ? <Spinner animation="border" variant="dark" size='sm' /> : proyecto && `$${formatNumber(proyecto.totalAlquilerXMes[mesAnterior])}`}</Col>
                        <Col className='text-resumen-alquileres'><b>{formatTextMix(mesActual)}:</b> {loadingProyectos ? <Spinner animation="border" variant="dark" size='sm' /> : proyecto && `$${formatNumber(proyecto.totalAlquilerXMes[mesActual])}`}</Col>
                        <Col className='text-resumen-alquileres'><b>{formatTextMix(mesPosterior)}:</b> {loadingProyectos ? <Spinner animation="border" variant="dark" size='sm' /> : proyecto && `$${formatNumber(proyecto.totalAlquilerXMes[mesPosterior])}`}</Col>
                    </>
                }
            </Row>
        </Row>
        {loadingProyectos ?
            <Row className='spinner-center-pag' >
                <Spinner animation="border" variant="dark" />
            </Row>
            :
            <Row className="acordion">
                <Accordion>
                    {
                        proyecto && proyecto.alquilers.length > 0 ?
                            proyecto.alquilers.map(alquiler => (
                                <Row key={alquiler.id_alquiler}>
                                    <Col xs={12}>
                                        <Accordion.Item eventKey={alquiler.id_alquiler}>
                                            <Accordion.Header>
                                                {new Date(alquiler.fecha_d_alquiler) <= new Date() && new Date() <= new Date(alquiler.fecha_h_alquiler) ?
                                                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Activo.</Tooltip>} ><Col xs={2} md={2} id="activo"></Col></OverlayTrigger>
                                                    :
                                                    (new Date() >= new Date(alquiler.fecha_h_alquiler) ?
                                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Finalizado.</Tooltip>} ><Col xs={2} md={2} className="state-finish"></Col></OverlayTrigger>
                                                        :
                                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>En espera.</Tooltip>} ><Col xs={2} md={2} id="no-activo"></Col></OverlayTrigger>
                                                    )
                                                }
                                                {determinarDeuda(alquiler.fecha_d_alquiler,alquiler.fecha_h_alquiler,alquiler.ingreso_alquilers)}
                                                <Col className="acordion-title" xs={4} md={3}>
                                                    <b>
                                                        {alquiler.modulo ?
                                                            alquiler.modulo.nombre_modulo || `${alquiler.modulo.tipologia} - ${alquiler.modulo.id_modulo} - ${formatNumber(alquiler.modulo.ancho)} x ${formatNumber(alquiler.modulo.largo)} - ${alquiler.modulo.material_cerramiento}`
                                                            : `OD - ${alquiler.modulo_doble.id_modulo_doble} - OS - ${alquiler.modulo_doble.id_modulo_uno} - OS - ${alquiler.modulo_doble.id_modulo_dos} `
                                                        }
                                                    </b>
                                                </Col>
                                                <Col className="acordion-title" xs={3} md={2}><b>${formatNumber(alquiler.valor)}</b> </Col>
                                                <Col className="acordion-title" xs={3} md={2}>Cant. de Meses: <b>{CalcMesesAlquiler(alquiler.fecha_d_alquiler, alquiler.fecha_h_alquiler)}</b> </Col>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Row>
                                                    <Col xs={12} md={4}>Fecha de inicio: <b>:</b> {formatFecha(alquiler.fecha_d_alquiler)}</Col>
                                                    <Col xs={12} md={4}>Fecha de fin: <b>:</b> {formatFecha(alquiler.fecha_h_alquiler)} </Col>
                                                    <Col xs={12} md={4}>Valor por mes: <b>:</b> ${formatNumber(alquiler.valor/CalcMesesAlquiler(alquiler.fecha_d_alquiler, alquiler.fecha_h_alquiler))} </Col>
                                                </Row>
                                                {alquiler.ingreso_alquilers.length > 0 &&
                                                    <GraficIngresosAlquileres alquiler={alquiler} ingresoAlquiler={alquiler.ingreso_alquilers} />
                                                }
                                                {user.rango == 'admin' &&
                                                    <Row className="border-top">
                                                        <Col xs={12} md={12}>
                                                            <p className="accordion-title-section">Acciones</p>
                                                        </Col>
                                                        <Col xs={6} md={6}>
                                                            <button className="button-action" onClick={() => modalFormContrato('Renovar', alquiler)}>
                                                                <Row>
                                                                    <Col xs={1} md={1} className='icon-action'>
                                                                        <Icons.ArrowRepeat size={19} />
                                                                    </Col>
                                                                    <Col xs={10} md={10} className='text-action'>
                                                                        Renovar contrato
                                                                    </Col>
                                                                </Row>
                                                            </button>
                                                        </Col>
                                                        <Col xs={6} md={6}>
                                                            <button className="button-action" onClick={() => modalFormContrato('Modificar', alquiler)}>
                                                                <Row>
                                                                    <Col xs={1} md={1} className='icon-action'>
                                                                        <Icons.PencilSquare size={19} />
                                                                    </Col>
                                                                    <Col xs={10} md={10} className='text-action'>
                                                                        Modificar Contrato
                                                                    </Col>
                                                                </Row>
                                                            </button>
                                                        </Col>
                                                        <Col xs={6} md={6}>
                                                            <button className="button-action" onClick={() => setShowModalFormIngresoAlquiler(true)}>
                                                                <Row>
                                                                    <Col xs={1} md={1} className='icon-action'>
                                                                        <Icons.Plus size={19} />
                                                                    </Col>
                                                                    <Col xs={10} md={10} className='text-action'>
                                                                        Agregar un Ingreso
                                                                    </Col>
                                                                </Row>
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                }
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Col>
                                </Row>
                            ))
                            :
                            <Col>
                                <h6>No existen alquileres</h6>
                            </Col>
                    }
                </Accordion>
            </Row>
        }
    </>)
}

export default React.memo(Alquileres);
