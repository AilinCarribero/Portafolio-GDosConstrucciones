import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

//Servicios
import { insertModulos } from '../../../services/apiModulos';

//Hooks
import { ToastComponent } from '../../../hooks/useUtils';

//Css
import './Modulos.css'

const FormModulos = () => {
    const newDate = new Date();
    const año = newDate.getFullYear();
    const mes = newDate.getMonth();
    const dia = newDate.getDate();

    const [validated, setValidated] = useState(false);

    const [modulo, setModulo] = useState({
        nombre_modulo: '',
        costo: '',
        venta: '',
        fecha_creacion: new Date().toISOString().slice(0, 10),
        fecha_venta: '',
        estado: ''
    })

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value

        setModulo(prevModulo => ({
            ...prevModulo,
            [targetName]: targetValue
        }))
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        let auxModulo = {};

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            auxModulo = { ...modulo }

            try {
                const resModulo = await insertModulos(auxModulo);

                if (resModulo.data.todoOk == 'Ok') {
                    ToastComponent('success');

                    setModulo({
                        nombre_modulo: '',
                        costo: '',
                        venta: '',
                        fecha_creacion: new Date().toISOString().slice(0, 10),
                        fecha_venta: '',
                        estado: ''
                    });
                    setValidated(false);
                } else {
                    ToastComponent('error');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (<>
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-modulo mobile-form-modulo">
                    <Card.Header className="title-form" >Ingrese un Nuevo Modulo</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmitForm} >
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Nombre del Modulo">
                                    <Form.Control onChange={handleChangeForm} name="nombre_modulo" type="text" value={modulo.nombre_modulo} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Row>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Costo">
                                            <Form.Control onChange={handleChangeForm} name="costo" type="number" value={modulo.costo} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Venta">
                                            <Form.Control onChange={handleChangeForm} name="venta" type="number" value={modulo.venta} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/*<FloatingLabel label="Estado en el que se encuentra el modulo">
                                <Form.Select onChange={handleChangeForm} name="estado" value={modulo.estado} >
                                    <option value="Libre"> Libre </option>
                                    <option value="En Alquiler"> En Alquiler </option>
                                    <option value="Vendido"> Vendido </option>
                                </Form.Select>
                            </FloatingLabel>*/}
                            <Button className="button-submit" variant="primary" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>)
}

export default React.memo(FormModulos);