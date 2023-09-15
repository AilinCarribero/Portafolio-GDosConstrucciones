import React from 'react'
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';

//Hook
import { useUser } from '../../../hooks/useUser';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setMenu } from '../../../redux/slice/Proyecto/proyectoSlice';

//img
import * as Icons from 'react-bootstrap-icons';

const Menu = ({ showMenu, changeShowMenu }) => {
    const { logout, user } = useUser();

    const menu = useSelector(state => state.proyectoRedux.menu);

    const dispatch = useDispatch();

    const handleRedirectQR = () => {
        window.open("https://me-qr.com/es/qr-code-generator/link", '_blank', 'noopener,noreferrer');

        //https://www.qrcode-monkey.com/es/#
        //https://me-qr.com/es/qr-code-generator/link
    }

    const handleChangeMenu = (typeMenu) => {
        if (showMenu) {
            changeShowMenu(false)
        }

        if (typeMenu) {
            dispatch(setMenu(typeMenu))
        }
    }

    return (
        <div className={`conteiner-menu ${showMenu ? '' : 'width-bar-close'}`}>
            {user.token && <>
                <div className='bar-menu-close'>
                    <Row>
                        <div className={`text-link ${showMenu ? 'fondo-link' : 'margin '}`}>
                            <div><Icons.PersonCircle size={20} /></div>
                        </div>
                    </Row>
                    <Row>
                        <Link className={`text-link ${showMenu ? 'fondo-link' : 'margin '} ${menu === 'resumen' && 'select-item'}`} to="/"
                            onClick={() => handleChangeMenu(user.rango === "admin" ? 'resumen' : (user.rango === 'taller' ? 'modulos' : 'alquileres'))}
                        >
                            <div><Icons.HouseFill size={20} /></div>
                        </Link>
                    </Row>
                    {user.rango == 'admin' &&
                        <Row>
                            <Link className={`text-link ${showMenu ? 'fondo-link' : 'margin '} ${menu === 'usuarios' && 'select-item'}`}
                                to="/usuarios" onClick={() => handleChangeMenu('usuarios')}
                            >
                                <div><Icons.PersonVcardFill size={20} /> </div>
                            </Link>
                        </Row>
                    }
                    {(user.rango == 'admin' || user.rango == 'moderador') &&
                        <Row>
                            <Link className={`text-link ${showMenu ? 'fondo-link' : 'margin '} ${menu === 'clientes' && 'select-item'}`}
                                to="/clientes" onClick={() => handleChangeMenu('clientes')}
                            >
                                <div> <Icons.PeopleFill size={20} /> </div>
                            </Link>
                        </Row>
                    }
                    {user.rango == 'admin' &&
                        <Row onClick={handleRedirectQR} >
                            <div className={`text-link ${showMenu ? 'fondo-link' : 'margin '}`}>
                                <div> <Icons.Tools className="icon" size="20px" /></div>
                            </div>
                        </Row>
                    }
                    <Row>
                        <Link className={`text-link ${showMenu ? 'fondo-link' : 'margin '}`} onClick={logout} to="/">
                            <div><Icons.DoorOpenFill size={20} /> </div>
                        </Link>
                    </Row>
                </div>
                <div className={`bar-menu-open ${showMenu ? 'scale-up-hor-left' : 'scale-up-hor-left-reverse'}`} >
                    <Row>
                        <div className={`text-link fondo-link`}>
                            <div className={`slide-right`}>{user.nombre_apellido}</div>
                        </div>
                    </Row>
                    <Row>
                        <Link className={`text-link fondo-link`} to="/"
                            onClick={() => handleChangeMenu(user.rango === "admin" ? 'resumen' : (user.rango === 'taller' ? 'modulos' : 'alquileres'))}
                        >
                            <div className={`slide-right`}>Inicio</div>
                        </Link>
                    </Row>
                    {user.rango == 'admin' &&
                        <Row>
                            <Link className={`text-link fondo-link`} to="/usuarios" onClick={() => handleChangeMenu('usuarios')} >
                                <div className={`slide-right`}>Usuarios</div>
                            </Link>
                        </Row>
                    }
                    {(user.rango == 'admin' || user.rango == 'moderador') &&
                        <Row>
                            <Link className={`text-link fondo-link`} to="/clientes" onClick={() => handleChangeMenu('clientes')} >
                                <div className={`slide-right`}>Clientes</div>
                            </Link>
                        </Row>
                    }
                    {user.rango == 'admin' &&
                        <Row onClick={handleRedirectQR} >
                            <div className={`text-link fondo-link`}>
                                <div className={`slide-right`}>QR </div>
                            </div>
                        </Row>
                    }
                    <Row>
                        <Link className={`text-link fondo-link`} onClick={logout} to="/">
                            <div className={`slide-right`}>Salir</div>
                        </Link>
                    </Row>
                </div>

            </>}
        </div>
    )
}

export default React.memo(Menu)
