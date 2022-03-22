import React, { useState } from "react";
import { Card, Col, Row, Form, FloatingLabel, Button } from "react-bootstrap";
import NumberFormat from 'react-number-format';

//Hooks
import { useUser } from "../../../hooks/useUser";
import { ToastComponent } from "../../../hooks/useUtils";

//Services
import { insertStock } from "../../../services/apiStock";

//Css
import "./Materiales.css";

const FormMateriales = ({ close, setStock }) => {
    const { user } = useUser();

    const [newMaterial, setNewMaterial] = useState({
        nombre_stock: '',
        valor: 0,
        restante_valor: 0,
        salida: new Date(),
        id_user: user.id
    });

    //Variables para validacion
    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setNewMaterial(prevNewMaterial => ({
            ...prevNewMaterial,
            [targetName]: targetValue
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            try {
                const resNewMaterial = await insertStock(newMaterial);

                if (resNewMaterial.todoOk == 'Ok' || resNewMaterial.statusText == 'OK' || resNewMaterial.status == 200) {
                    ToastComponent('success');

                    setStock(resNewMaterial.data);

                    setNewMaterial({
                        nombre_stock: '',
                        valor: 0,
                        restante_valor: 0,
                        salida: new Date(),
                        id_user: user.id
                    })

                    setValidated(false);
                    close();
                } else {
                    ToastComponent('error');
                }
            } catch (error) {
                console.log(error);
                ToastComponent('error');
            }
        }
    }

    return (<>
        <Col className="form-center">
            <Card>
                <Card.Header className="title-form"> Material </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} >
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Material" className="mb-3">
                                <Form.Control onChange={handleChangeForm} name="nombre_stock" type="text" value={newMaterial.nombre_stock} required />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Valor" className="mb-3">
                                <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                    onChange={handleChangeForm} name={"valor"} value={newMaterial.valor} required />
                            </FloatingLabel>
                        </Form.Group>
                        <Button className="button-submit" variant="dark" type="submit">
                            Guardar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    </>)
}

export default React.memo(FormMateriales);