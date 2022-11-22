import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Component
import Modulo from './view/Modulos/Modulo';
import Auth from './view/Auth/Auth';
import NotAcces from './view/Errors/NotAcces';

const Routers = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<NotAcces />} />
                <Route exact path="/:token" element={<Auth />} />
                <Route exact path="/modulo/:token" element={<Modulo />} />
            </Routes>
        </BrowserRouter>
    )
}

export default React.memo(Routers);