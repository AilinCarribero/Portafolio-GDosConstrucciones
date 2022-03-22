import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const insertStock = async (stock) => {
    const response = await axios.post(API+'stock/insert', stock, servisTokenConfig);
    return response;
}

export const updateStock = async (stock) => {
    const response = await axios.post(API+'stock/update', stock, servisTokenConfig);
    return response;
}

export const getStock = async () => {
    const response = await axios.get(API+'stock/', servisTokenConfig);
    return response.data;
}