import axios from "axios";
import { API, servisTokenConfig } from "./apiServices";

export const getApiClientes = async () => {
    const response = await axios.get(API+`cliente/`, servisTokenConfig);

    return response;
}

export const postApiNewCliente = async (data) => {
    const response = await axios.post(API+`cliente/nuevo`, data, servisTokenConfig);

    return response;
}

export const postApiUpdateCliente = async (data) => {
    const response = await axios.post(API+`cliente/update`, data, servisTokenConfig);

    return response;
}