import React from "react";
import { Col, Modal, Row } from "react-bootstrap";

//Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import '../../../../style/Modal.scss';

const Alerta = ({ titulo, mensaje, show, setShow, submit }) => {
    const handleClose = () => setShow(false);

    const handleSubmit = () => {
        submit(true);
        setShow(false);
    }

    return (<>
        <Modal show={show} onHide={handleClose} animation={false} className="content-modal-alertas">
            <Modal.Header closeButton className="content-modal-header"><Icons.ExclamationTriangleFill className="icono" /><b>{titulo}</b></Modal.Header>
            <Modal.Body className="content-modal-body">
                <Row className="content-modal-mensaje">{mensaje}</Row>
                <Row className="content-modal-buttons">
                    <Col xs={5} sm={5} id="button-aceptar" onClick={() => handleSubmit()}>Aceptar</Col>
                    <Col xs={2} sm={2}></Col>
                    <Col xs={5} sm={5} id="button-cancelar" onClick={() => handleClose()} >Cancelar</Col>
                </Row>
            </Modal.Body>
        </Modal>
    </>)
}

export default React.memo(Alerta);