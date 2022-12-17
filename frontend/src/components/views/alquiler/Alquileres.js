import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col, ModalBody } from 'react-bootstrap';
import Decimal from 'decimal.js-light';
import moment from 'moment';

//Redux
import { useSelector } from 'react-redux';

//Components
import FormContrato from './FormContrato';

//Hooks
import { formatFecha, formatNameMes, formatNumber, formatTextMix } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';
import { useGetAlquileresId } from '../../../hooks/useAlquileres';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import '../../../style/Alquiler.scss';

const Alquileres = () => {
    const mesActual = formatNameMes(moment().month());
    const mesAnterior = formatNameMes(moment().month() - 1);
    const mesPosterior = formatNameMes(moment().month() + 1);

    const { id } = useParams();
    const { user } = useUser();
    const { CalcMesesAlquiler, setAlquileres } = useGetAlquileresId(id);
    
    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const [proyecto, setProyecto] = useState(proyectos.find(proyecto => proyecto.id_proyecto == id));

    const [renovarAlquiler, setRenovarAlquiler] = useState([]);
    const [actionContrato, setActionContrato] = useState();
    //console.log(alquileres, mesAlquiler, totalAlquiler);
    const [showModalFormContrato, setShowModalFormContrato] = useState(false);


    useEffect(() => {
        setProyecto(proyectos.find(proyecto => proyecto.id_proyecto == id));
    }, [proyectos])

    const modalFormContrato = (action, alquiler) => {
        setShowModalFormContrato(true);
        setRenovarAlquiler(alquiler);
        setActionContrato(action);
    }

    return (<>
        {showModalFormContrato && <FormContrato alquiler={renovarAlquiler} show={showModalFormContrato} setShow={setShowModalFormContrato} setAlquileres={setAlquileres} actionContrato={actionContrato} />}

        <Row>
            <Col xs={12} md={8} className="titulo-alquileres-vista">{id}</Col>
            <Row className='content-resumen-alquileres'>
                <Col>
                    <button className="button-agregar" onClick={() => modalFormContrato('Nuevo')} variant="dark">
                        <Icons.Plus className="icon-button" size={19} /> Agregar Contrato
                    </button>
                </Col>
                <Col className='text-resumen-alquileres'><b>Total:</b> ${proyecto && formatNumber(proyecto.totalAlquiler)}</Col>
                <Col className='text-resumen-alquileres'><b>{formatTextMix(mesAnterior)}:</b> ${proyecto && formatNumber(proyecto.totalAlquilerXMes[mesAnterior])}</Col>
                <Col className='text-resumen-alquileres'><b>{formatTextMix(mesActual)}:</b> ${proyecto && formatNumber(proyecto.totalAlquilerXMes[mesActual])}</Col>
                <Col className='text-resumen-alquileres'><b>{formatTextMix(mesPosterior)}:</b> ${proyecto && formatNumber(proyecto.totalAlquilerXMes[mesPosterior])}</Col>
            </Row>
        </Row>
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
                                                <Col xs={2} md={2} id="activo"></Col>
                                                :
                                                (new Date() >= new Date(alquiler.fecha_h_alquiler) ?
                                                    <Col xs={2} md={2} className="state-finish"></Col>
                                                    :
                                                    <Col xs={2} md={2} id="no-activo"></Col>
                                                )
                                            }
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
                                                <Col xs={12} md={6}>Fecha de inicio: <b>:</b> {formatFecha(alquiler.fecha_d_alquiler)}</Col>
                                                <Col xs={12} md={6}>Fecha de fin: <b>:</b> {formatFecha(alquiler.fecha_h_alquiler)} </Col>
                                            </Row>
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
                                                    </Col><Col xs={6} md={6}>
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
    </>)
}

export default React.memo(Alquileres);
