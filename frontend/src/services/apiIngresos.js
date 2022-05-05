import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const insertIngreso = async (ingreso) => {
    const response = await axios.post(API+'ingresos/insert', ingreso, servisTokenConfig);
    return response;
}

export const getIngresos = async () => {
    const response = await axios.get(API+'ingresos/', servisTokenConfig);
    return response.data;
}

export const getIngresosId = async (id) => {
    const response = await axios.get(API+`ingresos/${id}`, servisTokenConfig);
    return response.data;
}

export const setUpdateIngreso = async (ingreso) => {
    const response = await axios.post(API+'ingresos/update', ingreso, servisTokenConfig);
    return response;
}

export const setDeleteIngreso = async (id, ingreso) => {
    const response = await axios.post(API+`ingresos/delete/${id}`, ingreso, servisTokenConfig);
    return response;
}