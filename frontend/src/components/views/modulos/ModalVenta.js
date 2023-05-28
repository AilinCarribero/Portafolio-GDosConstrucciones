import React, { useState } from 'react';
import { Col, Form, Modal, Row, FloatingLabel } from "react-bootstrap";
import { NumericFormat } from 'react-number-format';

//Hook
import { ToastComponent, desformatNumber } from '../../../hooks/useUtils';
import { useCliente } from '../../../hooks/useCliente';
import { useResponse } from '../../../hooks/useResponse';

//Api
import { postApiNewCliente } from '../../../services/apiClientes';

//Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import '../../../style/Modulos.scss';

const ModalVenta = ({ titulo, show, setShow, submit }) => {
    const { response } = useResponse();
    const { clientes } = useCliente();

    const [data, setData] = useState({
        venta: '',
        cliente: ''
    })

    const [showNewCliente, setShowNewCliente] = useState(false);

    const handleClose = () => setShow(false);

    const handleChangeForm = (e) => {
        const targetValue = e.target.value;
        const targetName = e.target.name;

        setData(prevData => ({
            ...prevData,
            [targetName]: targetValue
        }))
    }

    const handleSubmit = async () => {
        if (showNewCliente) {
            try {
                const resCliente = await postApiNewCliente({nombre: data.cliente});

                const resResponse = response(resCliente);

                if (resResponse) {
                    ToastComponent('success', 'El cliente fue guardado correctamente');
                }
            } catch (err) {
                console.error(err);
            }
        }

        submit({
            vender: true,
            valor: desformatNumber(data.venta),
            cliente: data.cliente
        });

        setData({
            cliente: '',
            venta: ''
        });
    }

    const handleNewCliente = (e) => {
        const targetCheck = e.target.checked;

        setShowNewCliente(targetCheck)
    }

    return (
        <Modal show={show} onHide={handleClose} animation={false} className="content-modal-alertas">
            <Modal.Header closeButton className="content-modal-header"><Icons.ExclamationTriangleFill className="icono" /><b>{titulo}</b></Modal.Header>
            <Modal.Body className="content-modal-body">
                <Row className="content-modal-mensaje">
                    <Form.Group>
                        <FloatingLabel label="Venta">
                            <NumericFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                onChange={handleChangeForm} name="venta" value={data.venta} />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <Row className="content-modal-mensaje">
                    {!showNewCliente ?
                        <Col sm={12}>
                            <FloatingLabel label="Cliente Existente">
                                <Form.Select onChange={handleChangeForm} name="cliente" value={data.cliente} required >
                                    <option value="" > </option>
                                    {clientes.length > 0 &&
                                        clientes.map((cliente) => (
                                            <option key={cliente.id_cliente} value={cliente.nombre}>
                                                {cliente.nombre}
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                        :
                        <Col sm={12}>
                            <FloatingLabel label="Nuevo Cliente">
                                <Form.Control onChange={handleChangeForm} name="cliente" type="text" value={data.cliente} />
                            </FloatingLabel>
                        </Col>
                    }
                    <Col xs={12} sm={12} className='' >
                        <Form.Check className='form-check-switch-new-cliente' onChange={handleNewCliente} label="Nuevo cliente" name="showNewCliente" type="switch" checked={showNewCliente} />
                    </Col>
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