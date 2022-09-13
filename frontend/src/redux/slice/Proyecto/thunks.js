import Decimal from "decimal.js-light";
import moment from "moment";
import { useSelector } from "react-redux";
import { calcularValorXMes } from "../../../hooks/useUtils";
import { getApiProyectos } from "../../../services/apiProyectos";
import { setProyectos, changeFiltros, activeLoading, removeFiltros } from "./proyectoSlice";

export const getProyectos = () => (dispatch) => {
    dispatch(activeLoading(true));

    getApiProyectos().then(proyectos => {
        //console.log(proyectos)
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