import { useEffect, useState } from "react";
import { getApiClientes } from "../services/apiClientes";

export const useCliente = () => {
    const [ clientes, setClientes ] = useState([]);

    useEffect(() => {
        (async () => {
            const resCliente = await getApiClientes();
            setClientes(resCliente.data);
        })()
        
    }, [])
    return { clientes, setClientes }
}