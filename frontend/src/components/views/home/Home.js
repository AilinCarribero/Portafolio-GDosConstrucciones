import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, FloatingLabel, Form, Col, FormGroup, Spinner } from 'react-bootstrap';

//Hooks
import { useUser } from '../../../hooks/useUser';
import { ToastComponent } from '../../../hooks/useUtils';

//Service
import { login } from '../../../services/apiAuth';

//Css
import '../../../style/Home.scss';

const Home = () => {
    const navigate = useNavigate();

    const { loginContext, user } = useUser();

    const [data, setData] = useState({
        usr_login: '',
        password: ''
    });

    const [showSpinner, setShowSpinner] = useState(false)

    const handleChange = async (e) => {
        const targetName = e.target.name
        const targetValue = e.target.value

        const loginInfo = prevData => ({
            ...prevData,
            [targetName]: targetValue
        });

        setData(loginInfo);
    }

    const loginPost = async (e) => {
        e.preventDefault();
        setShowSpinner(true);

        try {
            const userResponse = await login(data);

            const segCookie = 60 * 60 * 24 * 6;

            if (userResponse.data.token) {
                setShowSpinner(false);

                window.localStorage.setItem('loggedAppUser', JSON.stringify(userResponse.data));
                document.cookie = 'loggedAppUser=existo; max-age=' + segCookie + ';';

                loginContext(userResponse.data);

                navigate("/");
            } else {
                setShowSpinner(false);
                ToastComponent('error', userResponse.data);
                console.error('Error');
            }
        } catch (error) {
            setShowSpinner(false);
            ToastComponent('error', 'Error al intentar ingresar');
            console.error(error);
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                {!user.token &&
                    <Card className="text-center card">
                        <Card.Header className="title-form">Ingrese Usuario y Contraseña</Card.Header>
                        <Card.Body>
                            <Form onSubmit={loginPost}>
                                <FormGroup className="mb-3">
                                    <FloatingLabel controlId="floatingInput" label="Usuario" className="mb-3">
                                        <Form.Control onChange={handleChange} name="usr_login" type="text" value={data.usr_login} placeholder="PepeGomez" />
                                    </FloatingLabel>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <FloatingLabel controlId="floatingPassword" label="Contraseña">
                                        <Form.Control onChange={handleChange} name="password" type="password" value={data.password} placeholder="Password" />
                                    </FloatingLabel>
                                </FormGroup>
                                <Button className="button-submit" variant='dark' type="submit" disabled={showSpinner} >  {showSpinner ? <Spinner animation="border" variant="light" size='sm' /> : "Ingresar"} </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                }
            </Col>
        </Row>
    )
}

export default React.memo(Home);
