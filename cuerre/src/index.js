import React from 'react';
import ReactDOM from 'react-dom/client';
import Routers from './Routers';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import "./style/General.scss";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ToastContainer />
    <Routers />
  </React.StrictMode>
);