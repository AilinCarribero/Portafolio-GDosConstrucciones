import React from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap';

//Icons
import * as Icons from 'react-bootstrap-icons';
import { formatFecha, formatNumber } from '../../../../hooks/useUtils';

//Css
import './Validacion.css';

const ValidacionNewContrato = ({ mostrar, datos, setShow, setSubmit }) => {
    const handleClose = () => setShow(false);

    const handleEnviar = () => {
        setShow(false);
        setSubmit();
    }
    
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
                    <Col className="texto" xs={12} sm={12}><b>Proyecto: </b>{datos.id_proyecto} </Col>
                    {datos.nombre_modulo && <Col className="texto" xs={12} sm={12}><b>Módulo: </b>{datos.nombre_modulo} </Col>}
                    {datos.nombre_modulo_doble && <Col className="texto" xs={12} sm={12}><b>Módulo doble: </b>{datos.nombre_modulo_doble} </Col>}
                    <Col className="texto" xs={12} sm={12}><b>Fecha: </b>{`${formatFecha(datos.fecha_desde_cobro)} al ${formatFecha(datos.fecha_hasta_cobro)}`} </Col>
                    <Col className="texto" xs={12} sm={12}><b>Valor: </b>{ datos.valor_arg ?  `$${formatNumber(datos.valor_arg)}` : `USD$${formatNumber(datos.valor_usd)}`} </Col>
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

export default React.memo(ValidacionNewContrato);