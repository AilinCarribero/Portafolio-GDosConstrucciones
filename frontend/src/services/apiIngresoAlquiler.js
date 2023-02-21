import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const insertApiIngresoAlquiler = async (ingresoAlquiler) => {
    const response = await axios.post(API+'ingreso-alquiler/insert', ingresoAlquiler, servisTokenConfig);
    return response;
}
