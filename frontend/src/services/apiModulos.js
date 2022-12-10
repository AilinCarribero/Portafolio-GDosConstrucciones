import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getModulos = async () => {
    const response = await axios.get(API+'modulos/', servisTokenConfig );
    return response.data;
}

export const getApiCantModulos = async () => {
    const response = await axios.get(API+'modulos/cantidad-modulos', servisTokenConfig );
    return response.data;
}

export const insertModulos = async (modulo) => {
    const response = await axios.post(API+'modulos/insert', modulo, servisTokenConfig)
    return response;
}

export const setVendido = async (data) => {
    const response = await axios.post(API+`modulos/update/vendido/${data.id}`, data, servisTokenConfig);
    return response;
}

export const setUpdate = async (data, id) => {
    const response = await axios.post(API+`modulos/update/${id}`, data, servisTokenConfig);
    return response;
}

export const deleteApiModulo = async (id, data) => {
    const response = await axios.post(API+`modulos/delete/${id}`, data, servisTokenConfig);

    return response;
}

export const setApiVincularModulo = async (data) => {
    const response = await axios.post(API+`modulos/modulo-doble`, data, servisTokenConfig);

    return response;
}

export const getApiModulosDobles = async () => {
    const response = await axios.get(API+`modulos/listen/modulo-doble`, servisTokenConfig);

    return response.data;
}