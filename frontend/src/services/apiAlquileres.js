import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getAlquileresId = async (id) => {
    const response = await axios.get(API+`alquiler/${id}`, servisTokenConfig);
    return response.data;
}

export const postNewContrato = async (data) => {
    const response = await axios.post(API+`alquiler/renovar/contrato`, data, servisTokenConfig);
    return response;
}