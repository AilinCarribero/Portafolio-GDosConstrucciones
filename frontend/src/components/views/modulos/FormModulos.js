import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

//Servicios
import { insertModulos, setUpdate } from '../../../services/apiModulos';

//Hooks
import { desformatNumber, ToastComponent } from '../../../hooks/useUtils';

//Css
import './Modulos.css'
import NumberFormat from 'react-number-format';

const FormModulos = ({ close, updateModulo, setUpdateModulo }) => {
    const newDate = new Date();
    const año = newDate.getFullYear();
    const mes = newDate.getMonth();
    const dia = newDate.getDate();

    const [validated, setValidated] = useState(false);

    const [modulo, setModulo] = useState({
        nombre_modulo: updateModulo.nombre_modulo ? updateModulo.nombre_modulo : '',
        costo: updateModulo.costo ? updateModulo.costo : '',
        venta: updateModulo.venta ? updateModulo.venta : '',
        fecha_creacion: updateModulo.fecha_creacion ? new Date(updateModulo.fecha_creacion).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        fecha_venta: updateModulo.fecha_venta ? new Date(updateModulo.fecha_venta).toISOString().slice(0, 10) : '',
        estado: updateModulo.estado ? updateModulo.estado : '',
        descripcion: updateModulo.descripcion ? updateModulo.descripcion : ''
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
            auxModulo = {
                ...modulo,
                costo: desformatNumber(modulo.costo),
                venta: desformatNumber(modulo.venta)
            }

            try {
                let resModulo = [];
                
                if (updateModulo.length > 0) {
                    resModulo = await setUpdate(auxModulo, updateModulo.id_modulo);
                } else {
                    resModulo = await insertModulos(auxModulo);
                }

                if (resModulo && !resModulo.data.todoMal && (resModulo.data.todoOk == 'Ok' || resModulo.statusText == 'OK' || resModulo.status == 200)) {
                    ToastComponent('success');

                    setUpdateModulo(resModulo.data);

                    setModulo({
                        nombre_modulo: '',
                        costo: '',
                        venta: '',
                        fecha_creacion: new Date().toISOString().slice(0, 10),
                        fecha_venta: '',
                        estado: ''
                    });
                    setValidated(false);
                    close();
                } else {
                    ToastComponent('error', resModulo.data.todoMal && resModulo.data.todoMal);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (<>
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form mobile-form">
                    {!close && <Card.Header className="title-form" >Ingrese un Nuevo Modulo</Card.Header>}
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
                                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="costo" value={modulo.costo} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Venta">
                                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="venta" value={modulo.venta} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Descripción">
                                            <Form.Control as="textarea" row={3} onChange={handleChangeForm} name="descripcion" type="text" value={modulo.descripcion} required />
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
                            <Button className="button-submit" variant="dark" type="submit">
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