import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Hooks
import { useUser } from '../../../hooks/useUser';
import FiltrosProyectos from '../../utils/filtros/FiltrosProyectos';

//Componentes
import Sidenav from '../sidenav/Sidenav';

//Css
import '../../../style/Navbar.scss';

//Img - Icons
import * as Icons from 'react-bootstrap-icons';
import logo from '../../../img/logowhitev2.png';
import { getProyectos } from '../../../redux/slice/Proyecto/thunks';
import { useDispatch } from 'react-redux';

//Contexts
//import ProyectoProvider from '../../../contexts/ProyectosProvider';

const NavbarComponent = () => {
    const { logout, user } = useUser();
    
    const [show, setShow] = useState(true);

    const handleShow = () => { setShow(!show); };

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
                <Nav.Item className="url-qr-navbar" onClick={() => handleRedirectQR()} >
                    <Icons.Tools className="icon" size="20px" /> QR
                </Nav.Item>
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
        <Navbar className="navbar">
            {user.rango == 'admin' && <Sidenav />}
            <Container>
                <Link to="/">
                    <Image src={logo} className="align-top img" alt="GDos Construcciones" />
                </Link>
                {renderLogaut()}
            </Container>
        </Navbar>
        {window.location.pathname == "/" && (user.rango == 'admin' || user.rango == 'moderador') && <FiltrosProyectos show={show} />}
    </>)
}
export default NavbarComponent;
