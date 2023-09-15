import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
//Hooks
import { useUser } from '../../../hooks/useUser';

//Componentes
import Menu from '../menu/Menu';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { setMenu } from '../../../redux/slice/Proyecto/proyectoSlice';

//Css
import '../../../style/Navbar.scss';

//Img - Icons
import * as Icons from 'react-bootstrap-icons';
import logo from '../../../img/logowhitev2.png';

const NavbarComponent = () => {
    const { logout, user } = useUser();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const menu = useSelector(state => state.proyectoRedux.menu);

    const [showMenu, setShowMenu] = useState(false);

    const handleButton = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        //console.log(targetName, targetValue);
        dispatch(setMenu(targetName));
        navigate(`/menu/${targetName}`);
    }

    const handleRedirectQR = () => {
        window.open("https://me-qr.com/es/qr-code-generator/link", '_blank', 'noopener,noreferrer');

        //https://www.qrcode-monkey.com/es/#
        //https://me-qr.com/es/qr-code-generator/link
    }

    const renderLogaut = () => {
        if (user.token) {
            return (<>
                {/*Si no esta en la url de proyectos no se debe mostrar el boton de filtros*/}
                {/*<Nav.Item className="filtros" onClick={handleShow} >
                    <Icons.FunnelFill className="icon-filtros" size="25px" />
                </Nav.Item>*/}
                {user.rango == 'admin' &&
                    <Nav.Item className="url-qr-navbar" onClick={() => handleRedirectQR()} >
                        <Icons.Tools className="icon" size="20px" /> QR
                    </Nav.Item>
                }
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text> <b className="text-nombre">{user.nombre_apellido}</b> </Navbar.Text>
                </Navbar.Collapse>
                <Nav.Link className="botton-sesion" onClick={logout} to="/"><Icons.DoorOpenFill className="icon-salida" size="25px" /></Nav.Link>
            </>)
        }
    }

    useEffect(() => {
        renderLogaut();
        //eslint-disable-next-line
    }, [user])

    return (<>
        {isMobile ? showMenu && <Menu showMenu={showMenu} changeShowMenu={setShowMenu} /> : <Menu showMenu={showMenu} changeShowMenu={setShowMenu} />}
        <Navbar className="navbar">
            {/*(user.rango == 'admin' || user.rango == 'moderador') && <Sidenav />*/}
            <Container>
                <Row>
                    <Col xs={2} sm={1} className='navbar-item-menu' onClick={() => setShowMenu(!showMenu)}>
                        <Icons.List size={35} />
                    </Col>
                    <Col xs={3} sm={1} className='navbar-item-logo' onClick={() => { dispatch(setMenu('resumen')); navigate(`/`); }}>
                        <Image src={logo} className="img" alt="GDos Construcciones" />
                    </Col>
                    <Col xs={12} sm={10} className="menu-inicio">
                        <Row>
                            {user.rango == "admin" &&
                                <>
                                    <Col>
                                        <button className={menu == 'resumen' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="resumen">Resumen</button>
                                    </Col>
                                    <Col>
                                        <button className={menu == 'proyectos' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="proyectos">Proyectos</button>
                                    </Col>
                                    <Col>
                                        <button className={menu == 'alquileres' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="alquileres">Alquileres</button>
                                    </Col>
                                    <Col>
                                        <button className={menu == 'modulos' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos">Módulos</button>
                                    </Col>
                                    <Col>
                                        <button className={menu == 'modulos-dobles' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos-dobles">Módulos Dobles</button>
                                    </Col>
                                </>
                            }
                            {user.rango == "moderador" &&
                                <>
                                    <Col>
                                        <button className={menu == 'alquileres' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="alquileres">Alquileres</button>
                                    </Col>
                                    <Col>
                                        <button className={menu == 'modulos' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos">Módulos</button>
                                    </Col>
                                    <Col>
                                        <button className={menu == 'modulos-dobles' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos-dobles">Módulos Dobles</button>
                                    </Col>
                                </>
                            }
                            {user.rango == "taller" &&
                                <>
                                    <Col>
                                        <button className={menu == 'modulos' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos">Módulos</button>
                                    </Col>
                                    <Col>
                                        <button className={menu == 'modulos-dobles' ? 'menu-inicio-button-active' : 'menu-inicio-button-off'} onClick={handleButton} name="modulos-dobles">Módulos Dobles</button>
                                    </Col>
                                </>
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    </>)
}
export default NavbarComponent;
