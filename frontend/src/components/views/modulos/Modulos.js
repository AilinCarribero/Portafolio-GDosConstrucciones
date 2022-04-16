import React, { useState } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';

//Hooks
import { formatNumber } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';

//Css
import './Modulos.css';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

const Modulos = () => {
    const { modulos, setModulos } = useGetModulos();

    const [showForm, setShowForm] = useState(false);

    return (<>
        <Row className="conten-buttons-agregar">
            <Col xs={6} sm={6} md={4}>
                <Button className="button-agregar" onClick={() => setShowForm(!showForm)} variant="dark" >
                    <Icons.Plus className="icon-button" size={19} />
                    Agregar modulo
                </Button>
            </Col>
        </Row>
        <ModalFormulario formulario={'modulo'} show={showForm} setShow={setShowForm} updateNew={setModulos} />
        <div>
            <Row>
                <Accordion>
                    {
                        modulos && modulos.length > 0 &&
                        modulos.map(modulo => (
                            <Col key={modulo.id_modulo}>
                                <Accordion.Item eventKey={modulo.id_modulo}>
                                    <Accordion.Header> {modulo.nombre_modulo} </Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Costo: ${formatNumber(modulo.costo)}</p></Col>
                                                </Row>
                                            </Col>
                                            {modulo.fecha_venta >= modulo.fecha_creacion && modulo.estado == 2 &&
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Venta: ${formatNumber(modulo.venta)}</p></Col>
                                                    </Row>
                                                </Col>
                                            }
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Fecha de creación: {new Date(modulo.fecha_creacion).toISOString().slice(0, 10)}</p></Col>
                                                </Row>
                                            </Col>
                                            {modulo.fecha_venta >= modulo.fecha_creacion && modulo.fecha_venta &&
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Fecha de Venta: {new Date(modulo.fecha_venta).toISOString().slice(0, 10)}</p></Col>
                                                    </Row>
                                                </Col>
                                            }
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    {modulo.estado == 0 && <Col xs={11} md={11}><p> Estado: Disponible</p></Col>}
                                                    {modulo.estado == 1 && <Col xs={11} md={11}><p> Estado: En alquiler</p></Col>}
                                                    {modulo.estado == 2 && <Col xs={11} md={11}><p> Estado: Vendido</p></Col>}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Col>
                        ))

                    }
                </Accordion>
            </Row>
        </div >
    </>)
}

export default React.memo(Modulos);