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

    console.log(alquileres);
    const [showModalRenovar, setShowModalRenovar] = useState(false);

    const cobroMensual = (alquiler) => {
        const fechaDesde = new Date(alquiler.fecha_d_alquiler);
        const fechaHasta = new Date(alquiler.fecha_h_alquiler);

        const mesDesde = fechaDesde.getMonth();
        const mesHasta = fechaHasta.getMonth();

        const cantMeses = fechaHasta - fechaDesde;

        console.log(fechaDesde, mesDesde)
        console.log(fechaHasta, mesHasta)
        console.log(cantMeses)
        console.log("---------------------------------------")

        /* Los meses van del 0 al 11 */
    }

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
                                {cobroMensual(alquiler)}
                                {showModalRenovar && <FormRenovar alquiler={alquiler} show={showModalRenovar} setShow={setShowModalRenovar} setAlquileres={setAlquileres} />}
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
