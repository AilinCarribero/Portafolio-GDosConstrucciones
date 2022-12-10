import { useEffect, useState } from "react";
import { getApiModulosDobles, getModulos } from "../services/apiModulos";

export const useGetModulos = () => {
    const [modulos, setModulos] = useState([]);
    const [modulosDobles, setModulosDobles] = useState([]);

    useEffect(() => {
        (async () => {
            const resModulos = await getModulos();

            setModulos(resModulos);

            const resModulosDobles = await getApiModulosDobles();

            setModulosDobles(resModulosDobles);
        })()
    }, [])
    return { modulos, setModulos, modulosDobles, setModulosDobles }
}