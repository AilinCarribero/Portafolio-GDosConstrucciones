import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Component
import Modulo from './view/Modulos/Modulo';
import Auth from './view/Auth/Auth';

const Routers = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/:token" element={<Auth />} />
                {sessionStorage.getItem("auth_ok") ?
                    <Route exact path="/modulo/:token" element={<Modulo />} />
                    :
                    <Route exact path="/:token" element={<Auth />} />
                }
            </Routes>
        </BrowserRouter>
    )
}

export default React.memo(Routers);