import React, { useEffect, useState } from "react";
import { Button, Col, Row, Accordion, Form } from "react-bootstrap";

//Component
import ModalFormulario from "../../utils/modal/formularios/ModalFormulario";
import ModRestante from "./ModRestante";

//Hooks
import { useGetStock } from "../../../hooks/useStock";
import { formatNumber } from "../../../hooks/useUtils";

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const Materiales = () => {
    const { stock, setStock } = useGetStock();
    
    const [showForm, setShowForm] = useState(false);
    const [showModRestante, setShowModRestante] = useState(false);
    const [paramMaterial, setParamMaterial] = useState([]);

    const updateRestanteValor = (material) => {
        setParamMaterial(material);
        setShowModRestante(true);
    }

    return (<>
        <Button onClick={() => setShowForm(!showForm)} variant="dark" >Agregar material</Button>
        <ModalFormulario formulario={'materiales'} show={showForm} setShow={setShowForm} />
        {showModRestante && <ModRestante show={showModRestante} stock={paramMaterial} setShow={setShowModRestante} setStock={setStock}/>}

        <Accordion>
            {
                stock && stock.length > 0 &&
                stock.map(material => (
                    <Col key={material.id_stock}>
                        <Accordion.Item eventKey={material.id_stock}>
                            <Accordion.Header>
                                <Col xs={4} md={4}><b>{material.nombre_stock}</b></Col>
                                <Col xs={4} md={4}>Queda: ${formatNumber(material.restante_valor)} </Col>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Row>
                                                    <Col xs={1} md={1}>
                                                        <button className="icon-sum" onClick={() => updateRestanteValor(material)}><Icons.PlusSquareFill className="icon-sum" size={19} /></button>
                                                    </Col>
                                                    <Col xs={11} md={11}>
                                                        Total Ingresado: ${formatNumber(material.valor)}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12} md={12}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}>Ingresado por {material.usuario.nombre_apellido}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}> Creado: {new Date(material.createdAt).toISOString().slice(0, 10)}</Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}>Ultimo Cambio: {new Date(material.updatedAt).toISOString().slice(0, 10)}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Col>
                ))
            }
        </Accordion>
    </>)
}

export default React.memo(Materiales);