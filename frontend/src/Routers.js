import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Redirect, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

//Views Components
import Home from './components/views/home/Home';
import FormEgresos from './components/views/egresos/FormEgresos';
import FormIngresos from './components/views/ingresos/FormIngresos';
import NavbarComponent from './components/marco/navbar/Navbar';
import Proyectos from './components/views/proyectos/Proyectos';
import FormProyectos from './components/views/proyectos/FormProyectos';
import FormUsuarios from './components/views/usuarios/FormUsuarios';
import Usuarios from './components/views/usuarios/Usuarios';
import Egresos from './components/views/egresos/Egresos';
import Ingresos from './components/views/ingresos/Ingresos';
import FormModulos from './components/views/modulos/FormModulos';
import Modulos from './components/views/modulos/Modulos';
import Alquileres from './components/views/alquiler/Alquileres';
import CentrosCostos from './components/views/proyectos/CentrosCostos';

//Hooks
import { useUser } from './hooks/useUser';
import { useDispatch } from 'react-redux';
import { getProyectos } from './redux/slice/Proyecto/thunks';

//Contexts
//import ProyectoProvider from './contexts/ProyectosProvider';

const Routers = () => {
    const { user } = useUser();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProyectos());
    }, [user.token])

    return (
        <>
            <NavbarComponent path={window.location.pathname} />
            <Container fluid>
                <Routes>
                    {!user.token ?
                        <Route exact path="/" element={<Home />} />
                        :
                        <>
                            <Route exact path="/" element={<Proyectos />} />
                            {user.rango == 'admin' &&
                                <>
                                    <Route exact path="/menu/:seccion" element={<Proyectos />} />
                                    <Route exact path="/ingresar/egreso" element={<FormEgresos />} />
                                    <Route exact path="/ingresar/ingreso" element={<FormIngresos />} />
                                    <Route exact path="/ingresar/proyecto" element={<FormProyectos />} />
                                    <Route exact path="/ingresar/usuario" element={<FormUsuarios />} />
                                    <Route exact path="/ingresar/modulos" element={<FormModulos />} />
                                    <Route exact path="/usuarios" element={<Usuarios />} />
                                    <Route exact path="/modulos" element={<Modulos />} />
                                    <Route exact path="/egresos/:id" element={<Egresos />} />
                                    <Route exact path="/ingresos/:id" element={Ingresos} />
                                    <Route exact path="/modulos/:id" element={<Modulos />} />
                                    <Route exact path="/cc" element={<CentrosCostos />} />
                                    <Route exact path="/ccp" element={<CentrosCostos />} />
                                    <Route exact path="/alquileres/:id" element={<Alquileres />} />
                                </>
                            }
                            {user.rango == 'moderador' &&
                                <>
                                    <Route exact path="/ingresar/egreso" element={FormEgresos} />
                                    <Route exact path="/ingresar/ingreso" element={FormIngresos} />
                                    <Route exact path="/egresos/:id" element={Egresos} />
                                    <Route exact path="/ingresos/:id" element={Ingresos} />
                                </>
                            }
                            {user.rango == 'usuario comun' &&
                                <>
                                    <Route exact path="/ingresar/egreso" element={FormEgresos} />
                                    <Route exact path="/egresos/:id" element={Egresos} />
                                </>
                            }
                        </>
                    }
                    <Route path="*" element={<Home />} />
                </Routes>
            </Container>
        </>
    )
}

export default Routers;