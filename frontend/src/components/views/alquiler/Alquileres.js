import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col, ModalBody } from 'react-bootstrap';
import Decimal from 'decimal.js-light';
import moment from 'moment';

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
    const { alquileres, mesAlquiler, totalAlquiler, setAlquileres } = useGetAlquileresId(id);

    const [renovarAlquiler, setRenovarAlquiler] = useState([]);
    //console.log(alquileres, mesAlquiler, totalAlquiler);
    const [showModalRenovar, setShowModalRenovar] = useState(false);
    const [showModalNewContrato, setShowModalNewContrato] = useState(false);

    const renovarContrato = (alquiler) => {
        setShowModalRenovar(true) 
        setRenovarAlquiler(alquiler)
    }

    return (<>
        {showModalNewContrato && <FormContrato show={showModalNewContrato} setShow={setShowModalNewContrato} setAlquileres={setAlquileres} />}
        <Row>
            <Col xs={12} md={8} className="titulo-alquileres-vista">{id}</Col>
            <Row className='content-resumen-alquileres'>
                <Col>
                    <button className="button-agregar" onClick={() => setShowModalNewContrato(true)} variant="dark">
                        <Icons.Plus className="icon-button" size={19} /> Agregar Contrato
                    </button>
                </Col>
                <Col className='text-resumen-alquileres'><b>Total:</b> ${formatNumber(totalAlquiler)}</Col>
                <Col className='text-resumen-alquileres'><b>{formatTextMix(mesAnterior)}:</b> ${formatNumber(mesAlquiler[mesAnterior])}</Col>
                <Col className='text-resumen-alquileres'><b>{formatTextMix(mesActual)}:</b> ${formatNumber(mesAlquiler[mesActual])}</Col>
                <Col className='text-resumen-alquileres'><b>{formatTextMix(mesPosterior)}:</b> ${formatNumber(mesAlquiler[mesPosterior])}</Col>
            </Row>
        </Row>
        <Row className="acordion">
            <Accordion>
                {
                    alquileres.length > 0 ?
                        alquileres.map(alquiler => (
                            <Row key={alquiler.id_alquiler}>
                                {showModalRenovar && <FormContrato alquiler={renovarAlquiler} show={showModalRenovar} setShow={setShowModalRenovar} setAlquileres={setAlquileres} />}
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
                                            <Col className="acordion-title" xs={4} md={4}><b>{alquiler.modulo.nombre_modulo}</b></Col>
                                            <Col className="acordion-title" xs={3} md={2}><b>${formatNumber(alquiler.valor)}</b> </Col>
                                            <Col className="acordion-title" xs={3} md={2}>Hasta: <b>{formatFecha(alquiler.fecha_h_alquiler)}</b> </Col>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <Col xs={12} md={6}>Fecha de inicio: <b>:</b> {formatFecha(alquiler.fecha_d_alquiler)}</Col>
                                            </Row>
                                            {user.rango == 'admin' &&
                                                <Row className="border-top">
                                                    <Col xs={12} md={12}>
                                                        <p className="accordion-title-section">Acciones</p>
                                                    </Col>
                                                    <Col xs={6} md={6}>
                                                        <button className="button-action" onClick={() => renovarContrato(alquiler)}>
                                                            <Row>
                                                                <Col xs={1} md={1} className='icon-action'>
                                                                    <Icons.PencilSquare size={19} />
                                                                </Col>
                                                                <Col xs={10} md={10} className='text-action'>
                                                                    Renovar contrato
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
