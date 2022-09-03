import React, { useState } from 'react'
import { Accordion, Row, Col } from 'react-bootstrap';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

//Hooks
import { formatFecha, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Servicios
import { setDeleteEgreso } from '../../../services/apiEgresos';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const AccordionEgreso = ({ egreso, setEgresos }) => {
    const { user } = useUser();
    const [showForm, setShowForm] = useState(false);

    const updateEgreso = () => {
        setShowForm(true);
    }

    const deleteEgreso = async (id, egreso) => {
        const resEgreso = await setDeleteEgreso(id, egreso);

        if ((resEgreso.statusText == 'OK' || resEgreso.status == 200 || resEgreso.data.todoOk == 'Ok') && !resEgreso.data.todoMal) {
            ToastComponent('success', 'Se eliminó con éxito');

            setEgresos(resEgreso.data);
        } else {
            resEgreso.data.todoMal ? ToastComponent('error', resEgreso.data.todoMal) : ToastComponent('error');
            console.log(resEgreso)
        }
    }

    return (<>
        {showForm && <ModalFormulario formulario={'egreso'} informacion={egreso} show={showForm} setShow={setShowForm} updateNew={setEgresos} />}

        <Col>
            <Accordion.Item eventKey={egreso.id_egreso}>
                <Accordion.Header>
                    <Col className="acordion-title" xs={3} md={3}><b>{egreso.proveedor}</b> </Col>
                    <Col className="acordion-title" xs={3} md={3}>
                        {egreso.comprobante_pago.nombre_comprobante && egreso.comprobante_pago.tipo_comprobante &&
                            <b>{egreso.comprobante_pago.nombre_comprobante} {egreso.comprobante_pago.nombre_comprobante != 'Comprobante de Pago' && egreso.comprobante_pago.tipo_comprobante} {!egreso.comprobante_pago.numero_comprobante || egreso.comprobante_pago.numero_comprobante == 'undefined' ? '' : ' N°' + egreso.comprobante_pago.numero_comprobante}</b>
                        }
                    </Col>
                    <Col className="acordion-title-number" xs={2} md={2}><b>{egreso.valor_pago > 0 ? '$' + formatNumber(egreso.valor_pago) : 'USD$' + formatNumber(egreso.valor_usd)}</b> </Col>
                    <Col className="acordion-title" xs={3} md={3}><b>{egreso.observaciones}</b> </Col>
                </Accordion.Header>
                <Accordion.Body>
                    <Row>
                        <Col xs={12} md={12}> <b>{egreso.analisis_costo.analisis_costo}</b> </Col>
                    </Row>
                    <Row>
                        {egreso.stock && <Col xs={12} md={6}>Material<b>:</b> {egreso.stock.nombre_stock}</Col>}
                        <Col xs={12} md={6}>Fecha del pago<b>:</b> {formatFecha(egreso.fecha_pago)}</Col>
                        <Col xs={12} md={6}>Forma del pago<b>:</b> {egreso.forma_pago.forma_pago}</Col>
                        {(new Date(egreso.fecha_diferido_pago).toISOString().slice(0, 10) > new Date(egreso.fecha_pago).toISOString().slice(0, 10)) && <>
                            <Col xs={12} md={6}>Fecha diferida<b>:</b> {formatFecha(egreso.fecha_diferido_pago)}</Col>
                            {(egreso.cuotas > 0) && <>
                                <Col xs={6} md={6}>Cantidad de cuotas<b>:</b> {egreso.cuotas}</Col>
                                <Col xs={6} md={6}>Cuota N°<b>:</b> {egreso.cuota}</Col>
                            </>}
                        </>}
                    </Row>
                    <Row>
                        {egreso.comprobante_pago.nombre_comprobante && egreso.comprobante_pago.tipo_comprobante && <>
                            <Col xs={12} md={6}>Comprobante<b>:</b> {egreso.comprobante_pago.nombre_comprobante}</Col>
                            <Col xs={4} md={2}>Tipo<b>:</b> {egreso.comprobante_pago.tipo_comprobante}</Col>
                            <Col xs={6} md={3}>N°<b>:</b> {!egreso.comprobante_pago.numero_comprobante || egreso.comprobante_pago.numero_comprobante == 'undefined' ? '' : egreso.comprobante_pago.numero_comprobante}</Col>
                        </>}
                    </Row>
                    <Row>
                        {egreso.observaciones &&
                            <Col xs={12} md={12}>Observaciones<b>:</b> {egreso.observaciones}</Col>
                        }
                        <Col xs={12} md={12}>Nombre de quien cargo el comprobante<b>:</b> {egreso.usuario.nombre_apellido}</Col>
                    </Row>
                    {user.rango == 'admin' &&
                        <Row className="border-top">
                            <Col xs={12} md={12}>
                                <p className="accordion-title-section">Acciones</p>
                            </Col>
                            <Col xs={6} md={6}>
                                <button className="button-action" onClick={() => updateEgreso()}>
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
                            <Col xs={6} md={6}>
                                <button className="button-action" onClick={() => deleteEgreso(egreso.id_egreso, egreso)}>
                                    <Row>
                                        <Col xs={1} md={1} className='icon-action'>
                                            <Icons.TrashFill size={19} />
                                        </Col>
                                        <Col xs={10} md={10} className='text-action'>
                                            Eliminar
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

export default React.memo(AccordionEgreso);