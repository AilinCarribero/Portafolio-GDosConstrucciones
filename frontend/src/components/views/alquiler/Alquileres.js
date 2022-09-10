import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col } from 'react-bootstrap';

//Components
import FormRenovar from './FormRenovar';

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';
import { useGetAlquileresId } from '../../../hooks/useAlquileres';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import './Alquileres.css';

const Alquileres = () => {
    const { id } = useParams();
    const { user } = useUser();
    const { alquileres, setAlquileres } = useGetAlquileresId(id);

    const [showModalRenovar, setShowModalRenovar] = useState(false);

    return (<>
        <Row>
            <Col className="titulo-alquileres-vista">{id}</Col>
        </Row>
        <Row className="acordion">
            <Accordion>
                {
                    alquileres.length > 0 ?
                        alquileres.map(alquiler => (
                            <Row key={alquiler.id_alquiler}>
                                {showModalRenovar && <FormRenovar alquiler={alquiler} show={showModalRenovar} setShow={setShowModalRenovar} setAlquileres={setAlquileres}/>}
                                <Col xs={12}>
                                    <Accordion.Item eventKey={alquiler.id_alquiler}>
                                        <Accordion.Header>
                                            <Col className="acordion-title" xs={4} md={4}><b>{alquiler.modulo.nombre_modulo}</b></Col>
                                            <Col className="acordion-title" xs={3} md={3}><b>${formatNumber(alquiler.valor)}</b> </Col>
                                            <Col className="acordion-title" xs={3} md={3}>Hasta: <b>{formatFecha(alquiler.fecha_h_alquiler)}</b> </Col>
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
                                                        <button className="button-action" onClick={() => setShowModalRenovar(true)}>
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
                        : <Col>
                            <h6>No existen alquileres</h6>
                        </Col>
                }
            </Accordion>
        </Row>
    </>)
}

export default React.memo(Alquileres);
