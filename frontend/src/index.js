import React from 'react';
import ReactDOM from 'react-dom';
import UserProvider from './contexts/UserProvider';
import ProyectoProvider from './contexts/ProyectosProvider';
import Routers from './Routers';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from './redux/store';

//Css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './style/Global.scss';
import { BrowserRouter, Routes } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <UserProvider>
                <ProyectoProvider>
                    <ToastContainer />
                    <Routers />
                </ProyectoProvider>
            </UserProvider>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root'));

