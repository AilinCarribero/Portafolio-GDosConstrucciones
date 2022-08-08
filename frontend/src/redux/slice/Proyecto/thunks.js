import { useSelector } from "react-redux";
import { ToastComponent } from "../../../hooks/useUtils";
import { getApiProyectos } from "../../../services/apiProyectos";
import { setProyectos, addFiltros, activeLoading } from "./proyectoSlice";

export const getProyectos = () => (dispatch) => {
    dispatch(activeLoading(true));

    getApiProyectos().then(proyectos => {
        dispatch(setProyectos(proyectos));
    }).catch(err => {
        console.error(err);
    });
}

export const activeFiltros = (filtro) => (dispatch) => {
    dispatch(activeLoading(true));

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const filtros = useSelector(state => state.proyectoRedux.filtros);

    console.log(filtro)
    dispatch(addFiltros(filtro))

    let resultadoFiltroProyecto = proyectos.filter(proyecto => {
        if (filtros.fecha_cobro_hasta || filtros.fecha_cobro_desde) {
            for (let i = 0; i < proyecto.ingresos.length; i++) {
                if ((proyecto.ingresos[i].fecha_cobro >= filtros.fecha_cobro_desde
                    && proyecto.ingresos[i].fecha_cobro <= filtros.fecha_cobro_hasta)
                    ||
                    (proyecto.ingresos[i].fecha_diferido_cobro >= filtros.fecha_cobro_desde
                        && proyecto.ingresos[i].fecha_diferido_cobro <= filtros.fecha_cobro_hasta)) {
                    return proyecto //cobro 
                }
            }
        } else {
            return proyecto
        }
    }).filter(proyecto => {
        if (filtros.fecha_pago_hasta || filtros.fecha_pago_desde) {
            for (let i = 0; i < proyecto.egresos.length; i++) {
                if ((proyecto.egresos[i].fecha_pago >= filtros.fecha_pago_desde
                    && proyecto.egresos[i].fecha_pago <= filtros.fecha_pago_hasta)
                    ||
                    (proyecto.egresos[i].fecha_diferido_pago >= filtros.fecha_pago_desde
                        && proyecto.egresos[i].fecha_diferido_pago <= filtros.fecha_pago_hasta)) {
                    return proyecto //pago 
                }
            }
        } else {
            return proyecto
        }
    });

    if (resultadoFiltroProyecto.length > 0) { /*Nos aseguramos de tener resultados */
        dispatch(setProyectos(resultadoFiltroProyecto));
    } else if (resultadoFiltroProyecto.length <= 0 && filtros) {
        /*Si no se obtenieron resultados y exisen filtros muestra una alerta de que no se encontraron los resultados 
        y se resetean los proyectos que se muestran */
        //ToastComponent('warn', 'No se encontraron resultados');
        dispatch(setProyectos(proyectos));
    }
}