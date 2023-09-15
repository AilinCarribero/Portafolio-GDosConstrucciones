import React, { useState } from "react";
import { Row, Col, Button, Spinner, Card } from 'react-bootstrap';

//Components
import ModalFormulario from "../../utils/modal/formularios/ModalFormulario";
import Alerta from "../../utils/modal/validacion/Alerta";

//Service
import { getApiDeleteUser } from "../../../services/apiAuth";

//Hooks
import { useGetUser } from "../../../hooks/useUser";
import { useResponse } from "../../../hooks/useResponse";
import { ToastComponent } from "../../../hooks/useUtils";

//Css
import '../../../style/Usuario.scss';
import * as Icons from 'react-bootstrap-icons';

const Usuarios = () => {
    const { users, setUsers, showSpinner } = useGetUser();
    const { response } = useResponse();

    const [infoUpdate, setInfoUpdate] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [showAlerta, setShowAlerta] = useState(false);

    const [alerta, setAlerta] = useState({
        titulo: '',
        mensaje: '',
        data: ''
    });

    const setShowFormReset = (show) => {
        setShowForm(show);
        setInfoUpdate([]);
    }

    const updateModalUsuario = (usuario) => {
        setInfoUpdate(usuario);
        setShowForm(true);
    }

    const deleteUser = (usuario, setDelete) => {
        setAlerta({
            titulo: 'Eliminar módulo',
            mensaje: `¿Desea eliminar el usuario ${usuario.nombre_apellido}? Recuerde que si lo elimina no podrá recuperarlo`,
            data: usuario
        });

        setShowAlerta(true);

        if (setDelete) {
            getApiDeleteUser(usuario.id_user).then(async resUser => {
                const res = response(resUser);

                if (res) {
                    setUsers(resUser.data);

                    ToastComponent('success', 'Se eliminó correctamente');
                } else {
                    ToastComponent('error', resUser.data.todoMal && resUser.data.todoMal);
                }
            }).catch(err => {
                console.error(err);

                ToastComponent('error', err.data.todoMal && err.data.todoMal);
            })
        }
    }

    return (<>
        <ModalFormulario formulario={'usuario'} informacion={infoUpdate} show={showForm} setShow={setShowFormReset} updateNew={setUsers} />
        <Alerta titulo={alerta.titulo} mensaje={alerta.mensaje} show={showAlerta} setShow={setShowAlerta} submit={deleteUser} data={alerta.data} />

        <Row className="conten-buttons-agregar">
            <Col xs={12} sm={4} md={3}>
                <Button className="button-agregar" onClick={() => setShowForm(!showForm)} variant="dark" >
                    <Icons.Plus className="icon-button" size={19} />
                    Agregar Usuario
                </Button>
            </Col>
        </Row>

        {showSpinner ?
            <Row className='spinner-center-pag' >
                <Spinner animation="border" variant="dark" />
            </Row>
            :
            <Row className='conteiner-cards-usuarios'>
                {users.map(usuario =>
                    <Col xs={12} sm={6} md={3} lg={3} key={usuario.id_user} className='col-card-usuario'>
                        <Card className='card-content-usuario'>
                            <Card.Body>
                                <Card.Title className='card-title-usuario'>
                                    <div className="card-title-nombre-usuario">{usuario.nombre_apellido}</div>
                                    {usuario.rango.rango &&
                                        <div className={`card-etiqueta-rol-usuario 
                                        ${usuario.rango.rango === "admin" && "card-etiqueta-admin-usuario"} 
                                        ${usuario.rango.rango === "moderador" && "card-etiqueta-moderador-usuario"} 
                                        ${usuario.rango.rango === "taller" && "card-etiqueta-taller-usuario"} 
                                        ${usuario.rango.rango === "usuario comun" && "card-etiqueta-usuario-comun-usuario"}`
                                        }>
                                            {usuario.rango.rango}
                                        </div>
                                    }
                                </Card.Title>
                                <Card.Text>Usuario de Login: {usuario.usr_login ? usuario.usr_login : '-'} </Card.Text>
                                <Card.Text>E-mail: {usuario.correo ? usuario.correo : '-'} </Card.Text>
                                <Card.Text>Teléfono: {(usuario.telefono && usuario.telefono != 0) ? usuario.telefono : '-'}</Card.Text>
                            </Card.Body>
                            <Card.Footer className='card-footer-usuario'>
                                <Row>
                                    <Col xs={6} md={6}>
                                        <button className="button-action" onClick={() => updateModalUsuario(usuario)}>
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
                                        <button className="button-action" onClick={() => deleteUser(usuario)}>
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
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
        }
    </>)
}

export default React.memo(Usuarios);