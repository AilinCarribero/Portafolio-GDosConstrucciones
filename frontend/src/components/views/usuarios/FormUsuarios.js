import React, { useState } from "react";
import { Card, Button, Row, FloatingLabel, Form, Col, Spinner } from 'react-bootstrap';

//Hooks
import { ToastComponent } from '../../../hooks/useUtils';
import { useResponse } from "../../../hooks/useResponse";

//Servicios
import { getUser, insertUser, postApiEditUser } from "../../../services/apiAuth";

import '../../../style/Usuario.scss';

const FormUsuarios = ({ close, updateUsuario, setUpdateUsuarios }) => {
    const { response } = useResponse();

    const [newUser, setNewUser] = useState({
        nombre_apellido: updateUsuario.nombre_apellido ? updateUsuario.nombre_apellido : '',
        correo: updateUsuario.correo ? updateUsuario.correo : '',
        usr_login: updateUsuario.usr_login ? updateUsuario.usr_login : '',
        telefono: updateUsuario.telefono ? updateUsuario.telefono : '',
        contrasegna: '',
        id_rango: updateUsuario.id_rango ? updateUsuario.id_rango : ''
    })

    const [validated, setValidated] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value

        setNewUser(prevNewUser => ({
            ...prevNewUser,
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
            setShowSpinner(true);

            let resNewUser = [];

            try {
                if (updateUsuario && updateUsuario.id_user) {
                    resNewUser = await postApiEditUser({
                        ...newUser, id_user: updateUsuario.id_user,
                        oldContrasegna: updateUsuario.contrasegna,
                        newContrasegna: newUser.contrasegna,
                        telefono: newUser.telefono || null
                    });
                } else {
                    resNewUser = await insertUser(newUser);
                }

                const res = response(resNewUser);

                if (res) {
                    ToastComponent('success');

                    const resGetUser = await getUser();

                    setUpdateUsuarios(resGetUser);

                    setNewUser({
                        nombre_apellido: '',
                        correo: '',
                        contrasegna: '',
                        usr_login: '',
                        telefono: '',
                        id_rango: newUser.id_rango
                    })

                    setShowSpinner(false);
                    setValidated(false);

                    close();
                } else {
                    setShowSpinner(false);
                    if (resNewUser.data.message) {
                        ToastComponent('error', resNewUser.data.message);
                    } else {
                        ToastComponent('error');
                    }
                }
            } catch (error) {
                setShowSpinner(false);
                console.error(error);
                ToastComponent('error');
            }
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form mobile-form">
                    {!close && <Card.Header className="title-form" >Nuevo Usuario</Card.Header>}
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="Nombre y Apellido" className="mb-3">
                                    <Form.Control onChange={handleChangeForm} name="nombre_apellido" type="text" value={newUser.nombre_apellido} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="Usuario de ingreso" className="mb-3">
                                    <Form.Control onChange={handleChangeForm} name="usr_login" type="text" value={newUser.usr_login} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="Telefono" className="mb-3">
                                    <Form.Control onChange={handleChangeForm} name="telefono" type="text" value={newUser.telefono} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="E-mail" className="mb-3">
                                    <Form.Control onChange={handleChangeForm} name="correo" type="email" value={newUser.correo} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingPassword" label="Contraseña">
                                    <Form.Control onChange={handleChangeForm} name="contrasegna" type="text" value={newUser.contrasegna} required={!updateUsuario.contrasegna} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Permisos de Acceso</Form.Label>
                                <Row key={`inline-radio`} className="check">
                                    <Col xs={6} sm={6} >
                                        <Form.Check inline onChange={handleChangeForm} label="Administrador" name="id_rango" value="1" type="radio" required checked={newUser.id_rango == 1} />
                                    </Col>
                                    <Col xs={6} sm={6} >
                                        <Form.Check inline onChange={handleChangeForm} label="Usuario comun" name="id_rango" value="2" type="radio" required checked={newUser.id_rango == 2} />
                                    </Col>
                                    <Col xs={6} sm={6} >
                                        <Form.Check inline onChange={handleChangeForm} label="Moderador" name="id_rango" value="3" type="radio" required checked={newUser.id_rango == 3} />
                                    </Col>
                                    <Col xs={6} sm={6} >
                                        <Form.Check inline onChange={handleChangeForm} label="Taller" name="id_rango" value="4" type="radio" required checked={newUser.id_rango == 4} />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Button className="button-submit" variant="dark" type="submit" disabled={showSpinner}>
                                {showSpinner ? <Spinner animation="border" variant="light" size='sm' /> : "Guardar"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default React.memo(FormUsuarios);