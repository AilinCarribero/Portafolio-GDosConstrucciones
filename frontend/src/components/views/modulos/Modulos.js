import React, { useState } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';

//Css
import '../../../style/Modulos.scss';
import './Modulos.css';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const Modulos = () => {
    const { modulos, setModulos } = useGetModulos();
    console.log(modulos);
    const [showForm, setShowForm] = useState(false);

    return (<>
        <ModalFormulario formulario={'modulo'} show={showForm} setShow={setShowForm} updateNew={setModulos} />

        <Row className='content-resumen-sec-buttons'>
            <Row className="conten-buttons-agregar">
                <Col xs={6} sm={6} md={4}>
                    <Button className="button-agregar" onClick={() => setShowForm(!showForm)} variant="dark" >
                        <Icons.Plus className="icon-button" size={19} />
                        Agregar modulo
                    </Button>
                </Col>
            </Row>
        </Row>

        <div>
            <Row>
                <Accordion>
                    {
                        modulos && modulos.length > 0 &&
                        modulos.map(modulo => (
                            <Col key={modulo.id_modulo} className="accordion-modulos">
                                <Accordion.Item eventKey={modulo.id_modulo}>
                                    <Accordion.Header className="accordion-header-modulos">
                                        <Row>
                                            {modulo.estado == 0 && <Col xs={2} md={2} className="accordion-estado-modulos" id="disponible"></Col>}
                                            {modulo.estado == 1 && <Col xs={2} md={2} className="accordion-estado-modulos" id="ocupado"></Col>}
                                            {modulo.estado == 2 && <Col xs={2} md={2} className="accordion-estado-modulos" id="vendido"></Col>}
                                            <Col xs={6} md={6} className="accordion-nombre-modulos"> {modulo.nombre_modulo} </Col>
                                        </Row>
                                    </Accordion.Header>
                                    <Accordion.Body className='accordion-body-modulos'>
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
                                                    <Col xs={11} md={11}><p> Fecha de creación: {formatFecha(modulo.fecha_creacion)}</p></Col>
                                                </Row>
                                            </Col>
                                            {modulo.fecha_venta >= modulo.fecha_creacion && modulo.fecha_venta &&
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Fecha de Venta: {formatFecha(modulo.fecha_venta)}</p></Col>
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
                                       {/* <Row>
                                            <Col xs={12} md={12} >
                                                <Row className="accordion-border-top">
                                                    <Col xs={11} md={11}><p className="accordion-title-section">Trazabilidad</p></Col>
                                                </Row>
                                            </Col>
                                            {modulo.alquilers.map(alquiler => (
                                                <Row key={alquiler.id_proyecto} className="content-trazabilidad-modulos">
                                                    <Col xs={12} md={6}>
                                                        <Row>
                                                            <Col xs={1} md={1}></Col>
                                                            <Col xs={11} md={11}><p className='proyecto-trazabilidad-modulos'> {alquiler.id_proyecto} </p></Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Row>
                                                            <Col xs={1} md={1}></Col>
                                                            <Col xs={11} md={11}><p className='fecha-trazabilidad-modulos'> {formatFecha(alquiler.fecha_d_alquiler)} </p></Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Row>
                                                            <Col xs={1} md={1}></Col>
                                                            <Col xs={11} md={11}><p className='fecha-trazabilidad-modulos'> {formatFecha(alquiler.fecha_h_alquiler)} </p></Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            ))}
                                            </Row>*/}
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