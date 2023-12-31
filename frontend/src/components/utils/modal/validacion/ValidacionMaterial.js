import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

//Icons
import * as Icons from 'react-bootstrap-icons';
import { formatFecha, formatNumber } from '../../../../hooks/useUtils';

//Css
import './Validacion.css';

const ValidacionMaterial = ({ mostrar, datos, pago, comprobantes, setShow, setSubmit }) => {
    const handleClose = () => setShow(false);

    const handleEnviar = () => {
        setShow(false);
        setSubmit();
    }

    return (<>
        <Modal className="fondo-desenfocado" show={mostrar} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <Icons.ExclamationTriangleFill className="icono" />
                    <b>Confirme el envio</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {datos.length >= 1 ? datos.map((dato, i) => (
                    <Row key={i}>
                        {i == 0 && (<>
                            <Col className="texto" xs={12} sm={12}><b>Proyecto: </b>{datos.proyecto ? dato.proyecto : 'CCE'} </Col>
                            <Col className="texto" xs={12} sm={12}><b>Fecha de hoy: </b>{formatFecha(dato.fecha_pago)} </Col>
                            {pago.map(forma => (
                                forma.id_forma_pago == dato.id_forma_pago && <Col className="texto" xs={12} sm={12} key={forma.id_forma_pago}><b>Forma de pago: </b>{forma.forma_pago}</Col>
                            ))}
                            {comprobantes.map(comprobante => (
                                comprobante.id_comprobante_pago == dato.id_comprobante_pago && <Row key={comprobante.id_comprobante_pago} >
                                    <Col className="texto" xs={12} sm={12}><b>Comprobante de Pago: </b>{comprobante.nombre_comprobante} </Col>
                                    <Col className="texto" xs={3} sm={3}><b>Tipo: </b>{comprobante.tipo_comprobante} </Col>
                                    <Col className="texto" xs={5} sm={5}><b>N°: </b>{dato.numero_comprobante} </Col>
                                </Row>))
                            }
                            {dato.observaciones && <Col className="texto" xs={12} sm={12}><b>Observaciones: </b>{dato.observaciones}</Col>}
                        </>)}
                        {dato.cuota && (<>
                            {dato.cuotaNumero == 0 && <Col className="texto" xs={12} sm={12}><b>Cantidad de cuotas: </b>{dato.cuota}</Col>}
                            <Col className="texto" xs={6} sm={6}><b>Cuota N°: </b>{dato.cuotaNumero + 1}</Col>
                            <Col className="texto" xs={6} sm={6}><b>Monto: $</b>{formatNumber(dato.valor_pago)}</Col>
                            <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{formatFecha(dato.fecha_diferido_pago)}</Col>
                        </>)}
                        {dato.cheque >= 0 && (<>
                            <Col className="texto" xs={3} sm={3}><b>Cheque: </b>{dato.cheque + 1}</Col>
                            <Col className="texto" xs={6} sm={6}><b>Monto: $</b> {formatNumber(dato.valor_pago)}</Col>
                            <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{formatFecha(dato.fecha_diferido_pago)}</Col>
                        </>)}
                    </Row>
                ))
                    :
                    <Row>
                        <Col className="texto" xs={12} sm={12}><b>Proyecto: </b>{datos.proyecto ? datos.proyecto : 'CCE'} </Col>
                        <Col className="texto" xs={12} sm={12}><b>Fecha de hoy: </b>{formatFecha(datos.fecha_pago)} </Col>
                        {pago.map(forma => (
                            forma.id_forma_pago == datos.id_forma_pago &&
                            <Col className="texto" xs={12} sm={12} key={forma.id_forma_pago}><b>Forma de pago: </b>{forma.forma_pago}</Col>
                        ))}
                        {datos.fecha_diferido_pago &&
                            <Col className="texto" xs={12} sm={12}><b>Fecha a pagar: </b>{formatFecha(datos.fecha_diferido_pago)}</Col>
                        }
                        <Col className="texto" xs={12} sm={12}>
                            <b>Monto: </b>${formatNumber(datos.valor_pago)}
                        </Col>
                        {comprobantes && comprobantes.map(comprobante => (
                            comprobante.id_comprobante_pago == datos.id_comprobante_pago && <Row key={comprobante.id_comprobante_pago}>
                                <Col className="texto" xs={12} sm={12}><b>Comprobante de Pago: </b>{comprobante.nombre_comprobante} </Col>
                                <Col className="texto" xs={3} sm={3}><b>Tipo: </b>{comprobante.tipo_comprobante} </Col>
                                <Col className="texto" xs={6} sm={6}><b>N°: </b>{datos.numero_comprobante} </Col>
                            </Row>))}
                        {datos.observaciones &&
                            <Col className="texto" xs={12} sm={12}><b>Observaciones: </b>{datos.observaciones}</Col>
                        }
                    </Row>
                }
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
    </>)
}

export default React.memo(ValidacionMaterial);