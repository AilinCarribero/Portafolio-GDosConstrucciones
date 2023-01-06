import React from 'react';
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

//Contexts
//import ProyectoProvider from './contexts/ProyectosProvider';

const Routers = () => {
    const { user } = useUser();

    console.log(window.location);
    return (
        <>
            <NavbarComponent path={window.location.pathname} />
            <Container fluid>
                <Routes>
                    <Route exact path="/" element={user.token ? <> <Proyectos /> </> : <Home />} />
                    {user.rango == 'admin' &&
                        <>
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
                            <Route exact path="/alquileres" element={<CentrosCostos />} />
                            <Route exact path="/alquileres/:id" element={<Alquileres />} />
                            <Route exact path="/modulos" element={<CentrosCostos />} />
                            <Route exact path="/materiales" element={<CentrosCostos />} />
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
                    </Routes>
            </Container>
        </>
    )
}

export default Routers;