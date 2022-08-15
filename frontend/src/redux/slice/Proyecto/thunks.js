import { useSelector } from "react-redux";
import { getApiProyectos } from "../../../services/apiProyectos";
import { setProyectos, changeFiltros, activeLoading, removeFiltros } from "./proyectoSlice";

export const getProyectos = () => (dispatch) => {
    dispatch(activeLoading(true));

    getApiProyectos().then(proyectos => {
        dispatch(setProyectos(proyectos));
    }).catch(err => {
        console.error(err);
    });
}

export const removeOneFiltro = (filtro) => (dispatch) => {
    dispatch(activeLoading(true));

    getApiProyectos().then(proyectos => {
        dispatch(removeFiltros({
            filtro: filtro,
            proyectos: proyectos
        }))
    }).catch(err => {
        console.error(err);
    });
}