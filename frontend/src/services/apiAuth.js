import axios from 'axios';

import { API, servisTokenConfig } from './apiServices';

export const login = async (user) => {
    const response = await axios.post(API+'auth/login', user);
    return response;
}

export const insertUser = async (user) => {
    const response = await axios.post(API+'auth/registro', user , servisTokenConfig);
    return response;
}

export const getUser = async () => {
    const response = await axios.get(API+'auth/', servisTokenConfig);
    return response.data;
}

export const postApiEditUser = async (user) => {
    const response = await axios.post(API+'auth/edit', user, servisTokenConfig );

    return response;
}

export const getApiDeleteUser = async (id) => {
    const response = await axios.get(`${API}auth/${id}`, servisTokenConfig);

    return response;
}