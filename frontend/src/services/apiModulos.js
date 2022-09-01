import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getModulos = async () => {
    const response = await axios.get(API+'modulos/', servisTokenConfig );
    return response.data;
}

export const insertModulos = async (modulo) => {
    const response = await axios.post(API+'modulos/insert', modulo, servisTokenConfig)
    return response;
}

export const setVendido = async (data) => {
    console.log(data)
    const response = await axios.post(API+`modulos/update/vendido/${data.id}`, data, servisTokenConfig);
    return response;
}