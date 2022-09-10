import React, { useState } from 'react'
import { Button, Form, Modal, Row, FloatingLabel, Col } from 'react-bootstrap'
import NumberFormat from 'react-number-format';
import Decimal from 'decimal.js-light';

//Componets
import ValidacionRenovAlquiler from '../../utils/modal/validacion/ValidacionRenovAlquiler';

//Hooks
import { desformatNumber, formatFechaISO, formatNumber, ToastComponent } from '../../../hooks/useUtils';

//Service
import { postNewContrato } from '../../../services/apiAlquileres';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const FormRenovar = ({ alquiler, show, setShow, setAlquileres }) => {
    const [newContrato, setNewContrato] = useState({
        id_alquiler: alquiler.id_alquiler,
        id_modulo: alquiler.id_modulo,
        alquiler: alquiler,
        nombre_modulo: alquiler.modulo.nombre_modulo,
        id_proyecto: alquiler.id_proyecto,
        alquiler_total: alquiler.proyecto.alquiler_total,
        fecha_d_alquiler: formatFechaISO(alquiler.fecha_h_alquiler),
        fecha_h_alquiler: formatFechaISO(alquiler.fecha_h_alquiler),
        valor: '',
    });

    //Variables para validacion
    const [validated, setValidated] = useState(false);
    const [showModalValidation, setShowModalValidation] = useState(false);

    const handleClose = () => setShow(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        //console.log("tn: ", targetName, " tv: ", targetValue, " tc: ", targetCheck);

        setNewContrato(prevNewContrato => ({
            ...prevNewContrato,
            [targetName]: targetValue
        }))
    }

    const handleValidacion = (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        //Si todos los campos son correcto pasamos a setear los campos para verificarlos
        if (form.checkValidity() === true) {

            setNewContrato(prevNewContrato => ({
                ...prevNewContrato,
                alquiler_total: new Decimal(newContrato.alquiler_total).add(newContrato.valor ? desformatNumber(newContrato.valor) : 0).toNumber(),
                valor: desformatNumber(newContrato.valor)
            }))

            setShowModalValidation(true);
        }
    }

    const handleSubmit = async () => {
        let resNewContrato = [];

        try {
            resNewContrato = await postNewContrato(newContrato);

            if (resNewContrato && !resNewContrato.data.todoMal && (resNewContrato.data.todoOk == 'Ok' || resNewContrato.statusText == 'OK' || resNewContrato.status == 200)) {
                ToastComponent('success');

                setShow(false);
                setAlquileres(resNewContrato.data)

                setNewContrato({
                    id_alquiler: '',
                    id_modulo: '',
                    alquiler: '',
                    nombre_modulo: '',
                    id_proyecto: '',
                    alquiler_total: '',
                    fecha_d_alquiler: '',
                    fecha_h_alquiler: '',
                    valor: '',
                })
            } else {
                ToastComponent('error', resNewContrato.data.todoMal && resNewContrato.data.todoMal);
            }
        } catch (error) {
            console.log(error);
            ToastComponent('error');
        }
    }


    return (
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton className="content-modal-header"><b>Renovar Contrato del módulo {newContrato.nombre_modulo}</b></Modal.Header>
            <Modal.Body className="content-modal-body">
                <Row>
                    <Form noValidate validated={validated} onSubmit={handleValidacion}>
                        <Row>
                            <Col xs={12} sm={12} >Fechas del contrato</Col>
                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Inicio">
                                        <Form.Control onChange={handleChangeForm} name="fecha_d_alquiler" type="date" value={newContrato.fecha_d_alquiler} required />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Final">
                                        <Form.Control onChange={handleChangeForm} name="fecha_h_alquiler" type="date" value={newContrato.fecha_h_alquiler} required />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12}>
                                <FloatingLabel label="Total del alquiler">
                                    <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChangeForm} name="valor" value={newContrato.valor} required />
                                </FloatingLabel>
                            </Col>
                            <Col xs={12} sm={12} className="text-descripcion-agregar">
                                ${formatNumber(newContrato.alquiler_total)} + ${newContrato.valor ? newContrato.valor : 0} = ${formatNumber(new Decimal(newContrato.alquiler_total).add(newContrato.valor ? desformatNumber(newContrato.valor) : 0).toNumber())}
                            </Col>
                        </Row>

                        {showModalValidation &&
                            <ValidacionRenovAlquiler mostrar={showModalValidation} datos={newContrato} setShow={setShowModalValidation} setSubmit={handleSubmit} />
                        }

                        <Row>
                            <Button className="button-submit" variant="dark" type="submit">
                                Renovar el contrato
                            </Button>
                        </Row>
                    </Form>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default React.memo(FormRenovar);