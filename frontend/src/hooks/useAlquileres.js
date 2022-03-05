import { useEffect, useState } from "react";
import { getAlquileresId } from "../services/apiAlquileres";

export const useGetAlquileresId = (id) => {
    const [ alquileres, setAlquileres ] = useState([]);

    useEffect(() => {
        (async () => {
            const resAlquileres = await getAlquileresId(id);
            setAlquileres(resAlquileres);
        })()
    }, [])
    return { alquileres, setAlquileres }
}