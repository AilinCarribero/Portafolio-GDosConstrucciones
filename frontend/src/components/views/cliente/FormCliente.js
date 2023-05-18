import React, { useState } from 'react';
import { Button, Col, FloatingLabel, Form, Card, Row } from 'react-bootstrap';
import { PatternFormat } from 'react-number-format';
import { ToastComponent } from '../../../hooks/useUtils';
import { postApiNewCliente, postApiUpdateCliente } from '../../../services/apiClientes';
import { useResponse } from '../../../hooks/useResponse';

const FormCliente = ({ close, updateCliente, setUpdateClientes }) => {
    const { response } = useResponse();
    const [cliente, setCliente] = useState({
        nombre: updateCliente.nombre ? updateCliente.nombre : '',
        correo: updateCliente.correo ? updateCliente.correo : '',
        telefono: updateCliente.telefono && updateCliente.telefono != 0 ? updateCliente.telefono : '',
        direccion: updateCliente.direccion ? updateCliente.direccion : '',
    });

    //Variables de validacion
    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setCliente(prevCliente => ({
            ...prevCliente,
            [targetName]: targetValue
        }))
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            let resApi = [];

            try {
                if (updateCliente && updateCliente.id_cliente) {
                    const newDataCliente = {...cliente, id_cliente: updateCliente.id_cliente};

                    resApi = await postApiUpdateCliente(newDataCliente);
                } else {
                    resApi = await postApiNewCliente(cliente);
                }

                const res = response(resApi);

                if (res) {
                    ToastComponent('success', 'El cliente fue guardado correctamente');

                    setUpdateClientes(resApi.data);

                    setCliente({
                        id_cliente: '',
                        nombre: '',
                        correo: '',
                        telefono: '',
                        direccion: '',
                    })

                    setValidated(false);
                    close();
                }
            } catch (err) {
                ToastComponent('error', 'No se pudieron guardar los datos del cliente');
                console.error(err);
            }
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form mobile-form">
                    {!close && <Card.Header className="title-form" >Ingrese un Nuevo Cliente</Card.Header>}
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmitForm} >
                            {updateCliente ?
                                <Form.Group className="mb-3">
                                    <Form.Label className="label-title-cliente">{cliente.nombre}</Form.Label>
                                </Form.Group>
                                :
                                <Col sm={12} >
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Nombre del Cliente">
                                            <Form.Control onChange={handleChangeForm} name="nombre" type="text" value={cliente.nombre} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            }
                            <Col sm={12} >
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="E-mail del Cliente">
                                        <Form.Control onChange={handleChangeForm} name="correo" type="email" value={cliente.correo} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col sm={12} >
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Domicilio del Cliente">
                                        <Form.Control onChange={handleChangeForm} name="direccion" type="text" value={cliente.direccion} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col sm={12}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Número de teléfono">
                                        <PatternFormat customInput={Form.Control} format='### #### ###'
                                            onChange={handleChangeForm} name="telefono" value={cliente.telefono} />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Button className="button-submit" variant="dark" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default React.memo(FormCliente);