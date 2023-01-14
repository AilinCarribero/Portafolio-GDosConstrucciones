import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "../redux/slice/Modulo/moduloSlice";
import { getApiModulosDobles, getModulos } from "../services/apiModulos";

export const useGetModulos = () => {
    const [modulos, setModulos] = useState([]);
    const [modulosDobles, setModulosDobles] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            dispatch(changeLoading(true));     
            const resModulos = await getModulos();

            setModulos(resModulos);

            const resModulosDobles = await getApiModulosDobles();

            setModulosDobles(resModulosDobles);

            dispatch(changeLoading(false));     
        })()
    }, [])
    return { modulos, setModulos, modulosDobles, setModulosDobles }
}