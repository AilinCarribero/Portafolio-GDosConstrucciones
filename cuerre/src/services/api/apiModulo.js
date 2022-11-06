import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, auth } from "../config";

export const getApiModulo = async (token) => {
    try {
        const response = await axios.get(API + `modulos/${token}`, auth);

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
}