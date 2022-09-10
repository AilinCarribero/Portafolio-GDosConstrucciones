import React from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap';

//Icons
import * as Icons from 'react-bootstrap-icons';
import { formatFecha, formatNumber } from '../../../../hooks/useUtils';

//Css
import './Validacion.css';

const ValidacionRenovAlquiler = ({ mostrar, datos, setShow, setSubmit }) => {
    const handleClose = () => setShow(false);

    const handleEnviar = () => {
        setShow(false);
        setSubmit();
    }
    console.log(datos)
    return (
        <Modal className="fondo-desenfocado" show={mostrar} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <Icons.ExclamationTriangleFill className="icono" />
                    <b>Confirme el envio</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                   <Col className="texto" xs={12} sm={12}><b>Modulo: </b>{datos.nombre_modulo} </Col>
                   <Col className="texto" xs={12} sm={12}><b>Fecha de Inicio: </b>{formatFecha(datos.fecha_d_alquiler)} </Col>
                   <Col className="texto" xs={12} sm={12}><b>Fecha de Vencimiento: </b>{formatFecha(datos.fecha_h_alquiler)} </Col>
                   <Col className="texto" xs={12} sm={12}><b>Valor total del alquiler: </b>{formatNumber(datos.valor)} </Col>
                </Row>
                <Row className="button-contenedor">
                    <Col sm={6} xs={6}>
                        <Button className="button-validacion" variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </Col>
                    <Col sm={6} xs={6}>
                        <Button className="button-validacion" variant="dark" onClick={handleEnviar}>
                            Enviar
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default React.memo(ValidacionRenovAlquiler);