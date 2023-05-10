import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getAlquileresId = async (id) => {
    const response = await axios.get(API+`alquiler/${id}`, servisTokenConfig);
    return response.data;
}

export const postNewRenovarUpdateContrato = async (data) => {
    const response = await axios.post(API+`alquiler/ren-agr-upd/contrato`, data, servisTokenConfig);
    return response;
}

export const deleteApiContrato = async (id, data) => {
    const response = await axios.post(API+`alquiler/delete/${id}`, data, servisTokenConfig);

    return response;
}