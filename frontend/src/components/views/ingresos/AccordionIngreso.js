import React, { useState } from "react";
import { Accordion, Row, Col } from 'react-bootstrap';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const AccordionIngreso = ({ ingreso, setIngresos }) => {
    const { user } = useUser();
    
    const [showForm, setShowForm] = useState(false);

    const updateIngreso = () => {
        setShowForm(true);
    }

    return (<>
        {showForm && <ModalFormulario formulario={'ingreso'} informacion={ingreso} show={showForm} setShow={setShowForm} updateNew={setIngresos} />}

        <Col key={ingreso.id_ingreso}>
            <Accordion.Item eventKey={ingreso.id_ingreso}>
                <Accordion.Header>
                    <Col className="acordion-title" xs={4} md={4}><b>{ingreso.forma_cobro && ingreso.forma_cobro.forma_cobro}</b> </Col>
                    <Col className="acordion-title" xs={4} md={4}><b>{ingreso.observaciones}</b> </Col>
                    <Col className="acordion-title-number" xs={3} md={3}><b> {ingreso.valor_cobro > 0 ? '$' + formatNumber(ingreso.valor_cobro) : 'USD$' + formatNumber(ingreso.valor_usd)}</b> </Col>
                </Accordion.Header>
                <Accordion.Body>
                    <Row>
                        <Col xs={12} md={6}>Fecha del cobro<b>:</b> {formatFecha(ingreso.fecha_cobro)}</Col>
                        {(formatFecha(ingreso.fecha_diferido_cobro) > formatFecha(ingreso.fecha_cobro)) && <>
                            <Col xs={12} md={6}>Fecha diferida<b>:</b> {formatFecha(ingreso.fecha_diferido_cobro)}</Col>
                        </>}
                    </Row>
                    <Row>
                        {ingreso.observaciones &&
                            <Col xs={12} md={12}>Observaciones<b>:</b> {ingreso.observaciones}</Col>
                        }
                        <Col xs={12} md={12}>Nombre de quien cargo el comprobante<b>:</b> {ingreso.usuario.nombre_apellido}</Col>
                    </Row>
                    {user.rango == 'admin' &&
                        <Row className="border-top">
                            <Col xs={12} md={12}>
                                <p className="title-actions">Acciones</p>
                            </Col>
                            <Col xs={6} md={6}>
                                <button className="button-action" onClick={() => updateIngreso()}>
                                    <Row>
                                        <Col xs={1} md={1} className='icon-action'>
                                            <Icons.PencilSquare size={19} />
                                        </Col>
                                        <Col xs={10} md={10} className='text-action'>
                                            Modificar
                                        </Col>
                                    </Row>
                                </button>
                            </Col>
                        </Row>
                    }
                </Accordion.Body>
            </Accordion.Item>
        </Col>
    </>)
}

export default React.memo(AccordionIngreso);