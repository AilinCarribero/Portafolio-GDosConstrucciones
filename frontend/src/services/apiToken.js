import axios from "axios";
import { API, servisTokenConfig } from "./apiServices";

export const getApiTokenQRModulos = async () => {
    const response = await axios.get(API+`token/qr/modulos`, servisTokenConfig);

    return response.data;
}