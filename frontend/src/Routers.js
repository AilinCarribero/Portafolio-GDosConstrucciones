import React from 'react';
import { BrowserRouter, HashRouter, Redirect, Route } from 'react-router-dom';
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
    //console.log(user);
    return (
        <BrowserRouter>
            <NavbarComponent path={window.location.pathname} />
            <Container fluid>
                <HashRouter>
                    <Route exact path="/" render={() => {
                        return (user.token
                            ? <> <Proyectos /> </> : <Home />
                        )
                    }} />
                    {user.rango == 'admin' ?
                        <>
                            <Route exact path="/ingresar/egreso" component={FormEgresos} />
                            <Route exact path="/ingresar/ingreso" component={FormIngresos} />
                            <Route exact path="/ingresar/proyecto" component={FormProyectos} />
                            <Route exact path="/ingresar/usuario" component={FormUsuarios} />
                            <Route exact path="/ingresar/modulos" component={FormModulos} />
                            <Route exact path="/usuarios" component={Usuarios} />
                            <Route exact path="/modulos" component={Modulos} />
                            <Route exact path="/egresos/:id" component={Egresos} />
                            <Route exact path="/ingresos/:id" component={Ingresos} />
                            <Route exact path="/modulos/:id" component={Modulos} />
                            <Route exact path="/alquileres/:id" component={Alquileres} />
                            <Route exact path="/cc" component={CentrosCostos} />
                            <Route exact path="/ccp" component={CentrosCostos} />
                            <Route exact path="/alquileres" component={CentrosCostos} />
                            <Route exact path="/modulos" component={CentrosCostos} />
                            <Route exact path="/materiales" component={CentrosCostos} />
                        </>
                        :
                        <Redirect to="/" />
                    }
                    {user.rango == 'moderador' ?
                        <>
                            <Route exact path="/ingresar/egreso" component={FormEgresos} />
                            <Route exact path="/ingresar/ingreso" component={FormIngresos} />
                            <Route exact path="/egresos/:id" component={Egresos} />
                            <Route exact path="/ingresos/:id" component={Ingresos} />
                        </>
                        :
                        <Redirect to="/" />
                    }
                    {user.rango == 'usuario comun' ?
                        <>
                            <Route exact path="/ingresar/egreso" component={FormEgresos} />
                            <Route exact path="/egresos/:id" component={Egresos} />
                        </>
                        :
                        <Redirect to="/" />
                    }
                </HashRouter>
            </Container>
        </BrowserRouter>
    )
}

export default Routers;