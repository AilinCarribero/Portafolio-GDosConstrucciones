import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getApiProyectos = async () => {
    const response = await axios.get(API+'proyectos/', servisTokenConfig );
    return response.data;
}

export const insertProyecto = async (proyecto) => {
    const response = await axios.post(API+'proyectos/insert', proyecto, servisTokenConfig)
    return response;
}

export const setUpdateProyecto = async (proyecto) => {
    const response = await axios.post(API+'proyectos/update', proyecto, servisTokenConfig);
    return response;
}

export const getApiDeleteProyectos = async (id_proyecto) => {
    const responde = await axios.get(`${API}proyectos/delete/${id_proyecto}`, servisTokenConfig);

    return responde
}