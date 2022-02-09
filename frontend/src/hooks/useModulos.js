import { useEffect, useState } from "react";
import { getModulos } from "../services/apiModulos";

export const useGetModulos = () => {
    const [ modulos, setModulos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resModulos = await getModulos();
            setModulos(resModulos);
        })()
    }, [])
    return { modulos, setModulos }
}