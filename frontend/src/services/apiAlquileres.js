import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const getAlquileresId = async (id) => {
    const response = await axios.get(API+`alquiler/${id}`, servisTokenConfig);
    return response.data;
}