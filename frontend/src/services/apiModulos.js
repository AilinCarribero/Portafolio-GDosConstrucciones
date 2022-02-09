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