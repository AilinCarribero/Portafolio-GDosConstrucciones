import { useEffect, useState } from "react";
import { getApiProyectos } from "../services/apiProyectos";

export const useGetProyectos = () => {
    const [ proyectos, setProyectos ] = useState([]);

    useEffect(() => {
        (async () => {
            const resProyectos = await getApiProyectos();
            
            setProyectos(resProyectos);
        })()
    }, [])

    return { proyectos, setProyectos }
}