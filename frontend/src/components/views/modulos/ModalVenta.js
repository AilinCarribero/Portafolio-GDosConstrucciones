import React, { useState } from 'react';
import { Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import NumberFormat from 'react-number-format';

//Hook
import { desformatNumber } from '../../../hooks/useUtils';

//Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import '../../../style/Modulos.scss';

const ModalVenta = ({ titulo, show, setShow, submit }) => {
    const [venta, setVenta] = useState();

    const handleClose = () => setShow(false);
    
    const handleChangeForm = (e) => {
        const targetValue = e.target.value

        setVenta(targetValue)
    }

    const handleSubmit = () => {
        submit({
            vender: true, 
            valor: desformatNumber(venta)
        });

        setVenta();
    }

    return (
        <Modal show={show} onHide={handleClose} animation={false} className="content-modal-alertas">
            <Modal.Header closeButton className="content-modal-header"><Icons.ExclamationTriangleFill className="icono" /><b>{titulo}</b></Modal.Header>
            <Modal.Body className="content-modal-body">
                <Row className="content-modal-mensaje">
                    <Form.Group>
                        <FloatingLabel label="Venta">
                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                onChange={handleChangeForm} name="venta" value={venta} />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <Row className="content-modal-buttons">
                    <Col xs={5} sm={5} id="button-aceptar" onClick={() => handleSubmit()}>Aceptar</Col>
                    <Col xs={2} sm={2}></Col>
                    <Col xs={5} sm={5} id="button-cancelar" onClick={() => handleClose()} >Cancelar</Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default React.memo(ModalVenta)