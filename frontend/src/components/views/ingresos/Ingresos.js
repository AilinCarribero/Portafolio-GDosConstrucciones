import React from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col } from 'react-bootstrap';

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useGetIngresosId } from '../../../hooks/useIngresos';

//Css
import './Ingresos.css';

const Ingresos = () => {
    const { id } = useParams();
    const { ingresos } = useGetIngresosId(id);

    const SumatoriaIngresos = () => {
        let sumaIngreso = 0;
        ingresos.map(ingreso => {
            sumaIngreso += ingreso.valor_cobro;
        });

        return formatNumber(sumaIngreso);
    }

    const SumatoriaIngresosUSD = () => {
        let sumaIngreso = 0;
        ingresos.map(ingreso => {
            sumaIngreso += ingreso.valor_usd;
        })

        return formatNumber(sumaIngreso);
    }

    return (<>
        <Row>
            <Col md={6} className="titulo-ingresos-vista">Ingresos de {id} </Col>
            <Col xs={5} md={2} className="titulo-ingresos-vista">${SumatoriaIngresos()}</Col>
            <Col xs={5} md={2} className="titulo-ingresos-vista">USD${SumatoriaIngresosUSD()}</Col>
        </Row>
        <Row className="acordion">
            <Accordion>
                {
                    ingresos.length > 0 ?
                        ingresos.map(ingreso => (
                            <Col key={ingreso.id_ingreso}>
                                <Accordion.Item eventKey={ingreso.id_ingreso}>
                                    <Accordion.Header>
                                        <Col className="acordion-title" xs={4} md={4}><b>{ingreso.forma_cobro && ingreso.forma_cobro.forma_cobro}</b> </Col>
                                        <Col className="acordion-title" xs={4} md={4}><b>{ingreso.observaciones}</b> </Col>
                                        <Col className="acordion-title-number" xs={3} md={3}><b> {ingreso.valor_cobro > 0? '$'+formatNumber(ingreso.valor_cobro) : 'USD$'+formatNumber(ingreso.valor_usd)}</b> </Col>
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
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Col>
                        ))
                        : <Col>
                            <h6>No existen ingresos</h6>
                            <p>Agregar icono de alerta</p>
                        </Col>
                }
            </Accordion>
        </Row>
    </>)
}

export default React.memo(Ingresos);
