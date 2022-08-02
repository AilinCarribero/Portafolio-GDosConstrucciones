import React, { useState } from "react";
import { Button, Col, Row, Accordion } from "react-bootstrap";

//Component
import ModalFormulario from "../../utils/modal/formularios/ModalFormulario";
import ModRestante from "./ModRestante";

//Hooks
import { useGetStock } from "../../../hooks/useStock";
import { formatFecha, formatNumber } from "../../../hooks/useUtils";

//Css
import "../../../style/Material.scss";

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const Materiales = () => {
    const { stock, setStock } = useGetStock();

    console.log(stock);

    const [showForm, setShowForm] = useState(false);
    const [showModRestante, setShowModRestante] = useState(false);
    const [paramMaterial, setParamMaterial] = useState([]);

    const updateRestanteValor = (material) => {
        setParamMaterial(material); //Material que se pasa al modal de modificar
        setShowModRestante(true);//Abre el modal
    }

    return (<>
        <ModalFormulario formulario={'materiales'} show={showForm} setShow={setShowForm} updateNew={setStock} />
        {showModRestante && <ModRestante show={showModRestante} stock={paramMaterial} setShow={setShowModRestante} setStock={setStock} />}

        <Row className='content-resumen-sec-buttons'>
            <Row className="conten-buttons-agregar">
                <Col xs={6} sm={6} md={4}>
                    <Button className="button-agregar" onClick={() => setShowForm(!showForm)} variant="dark" >
                        <Icons.Plus className="icon-button" size={19} />
                        Agregar material
                    </Button>
                </Col>
            </Row>
        </Row>

        <Accordion>
            {
                stock && stock.length > 0 &&
                stock.map(material => (
                    <Col key={material.id_stock}>
                        <Accordion.Item eventKey={material.id_stock}>
                            <Accordion.Header>
                                <Col xs={4} md={4}><b>{material.nombre_stock}</b></Col>
                                <Col xs={3} md={3}>Queda: ${formatNumber(material.restante_valor)} </Col>
                                <Col xs={3} md={3}>Cantidad: {formatNumber(material.cantidad)} {material.medida == "m2" && material.medida} </Col>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Row>
                                                    <Col xs={11} md={11}>
                                                        Total Ingresado: ${formatNumber(material.valor)}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={11} md={11}>Ingresado por {material.usuario.nombre_apellido}</Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={11} md={11}> Creado: {formatFecha(material.createdAt)}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Row>
                                                    <Col xs={11} md={11}> Valor Unitario: ${formatNumber(material.valor_unidad)}</Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={11} md={11}>Ultimo Cambio: {formatFecha(material.updatedAt)}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {material.stock_movimientos &&
                                    <Row className="border-top">
                                        <Col xs={12} md={12}>
                                            <p className="title-actions">Trazabilidad</p>
                                        </Col>
                                        <Col xs={12} md={12}>
                                            <Row className="content-trazabilidad">
                                                {material.stock_movimientos.map((stockD) => (
                                                    <Col xs={12} md={4} key={stockD.id_movimiento}>
                                                        <Row className="detalle-trazabilidad">
                                                            <Col xs={12} md={6} className="text-action" >
                                                                Cant: {formatNumber(stockD.cantidad)}
                                                            </Col>
                                                            <Col xs={12} md={6} className="text-action" >
                                                                Unidad: ${formatNumber(stockD.valor_unidad)}
                                                            </Col>
                                                            <Col xs={12} md={6} className="text-action" >
                                                                Total: ${formatNumber(stockD.valor_total)} 
                                                            </Col><Col xs={12} md={12} className="text-action" >
                                                                Ingresó:{formatFecha(stockD.createdAt)}
                                                            </Col>
                                                            <Col xs={12} md={12} className="text-action" >
                                                                Lo ingresó: {stockD.usuario.nombre_apellido}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                                <Row className="border-top">
                                    <Col xs={12} md={12}>
                                        <p className="title-actions">Acciones</p>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <button className="button-action" onClick={() => updateRestanteValor(material)}>
                                            <Row>
                                                <Col xs={1} md={1}>
                                                    <Icons.PencilSquare size={19} />
                                                </Col>
                                                <Col xs={10} md={10} className="text-action">
                                                    Agregar Cantidad
                                                </Col>
                                            </Row>
                                        </button>
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