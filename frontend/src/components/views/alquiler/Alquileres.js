import React from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col } from 'react-bootstrap';

//Hooks
import { formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';
import { useGetAlquileresId } from '../../../hooks/useAlquileres';

//Css
import './Alquileres.css';

const Alquileres = () => {
    const { id } = useParams();
    const { user } = useUser();
    const { alquileres } = useGetAlquileresId(id);
    
    return (<>
        <Row>
            <Col className="titulo-alquileres-vista">{id}</Col>
        </Row>
        <Row className="acordion">
            <Accordion>
                {
                    alquileres.length > 0 ?
                        alquileres.map(alquiler => (
                            <Col key={alquiler.id_alquiler}>
                                <Accordion.Item eventKey={alquiler.id_alquiler}>
                                    <Accordion.Header>
                                        <Col className="acordion-title" xs={4} md={4}><b>{alquiler.modulo.nombre_modulo}</b></Col>
                                        <Col className="acordion-title" xs={3} md={3}><b>${formatNumber(alquiler.valor)}</b> </Col>
                                        <Col className="acordion-title" xs={3} md={3}>Hasta: <b>{new Date(alquiler.fecha_h_alquiler).toISOString().slice(0, 10)}</b> </Col>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col xs={12} md={6}>Fecha de inicio: <b>:</b> {new Date(alquiler.fecha_d_alquiler).toISOString().slice(0, 10)}</Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Col>
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
