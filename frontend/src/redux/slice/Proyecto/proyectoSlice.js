import { createSlice } from "@reduxjs/toolkit";

//Hooks
import { formatFechaISO, ToastComponent } from "../../../hooks/useUtils";

export const proyectoSlice = createSlice({
    name: 'proyecto',
    initialState: {
        filtros: [],
        proyectos: [],
        loading: false,
        error: false
    },
    reducers: {
        setProyectos: (state, action) => {
            state.proyectos = action.payload;
            state.loading = false;
        },
        addFiltros: (state, action) => {
            console.log(state, action);
            const newFiltro = action.payload;
            const oldFiltros = state.filtros;

            state.filtros = { ...oldFiltros, ...newFiltro };

            const filtros = state.filtros;
            const proyectos = state.proyectos;

            console.log(filtros)
            const resultadoFiltroProyecto = [];
            /*const resultadoFiltroProyecto = proyectos.filter(proyecto => {
                if (proyecto.ingresos && proyecto.ingresos.length > 0) {   
                    if (filtros.fecha_cobro_desde) {
                        proyecto.ingresos.map(ingreso => {
                            if (formatFechaISO(ingreso.fecha_cobro) >= formatFechaISO(filtros.fecha_cobro_desde)) {
                                return proyecto //cobro 
                            }

                            if (formatFechaISO(ingreso.fecha_diferido_cobro) >= formatFechaISO(filtros.fecha_cobro_desde)) {
                                return proyecto //cobro 
                            }
                        });
                    }

                    if (filtros.fecha_cobro_hasta) {
                        proyecto.ingresos.map(ingreso => {
                            if ((formatFechaISO(ingreso.fecha_cobro) <= formatFechaISO(filtros.fecha_cobro_hasta))
                                || (formatFechaISO(ingreso.fecha_diferido_cobro) <= formatFechaISO(filtros.fecha_cobro_hasta))) {
                                return proyecto //cobro 
                            }
                        });
                    }
                }

                if (proyecto.egresos && proyecto.egresos.length > 0) {
                    if (filtros.fecha_pago_desde) {
                        proyecto.egresos.map(egreso => {
                            if (formatFechaISO(egreso.fecha_pago) >= formatFechaISO(filtros.fecha_pago_desde)) {
                                return proyecto //pago 
                            }

                            if (formatFechaISO(egreso.fecha_diferido_pago) >= formatFechaISO(filtros.fecha_pago_desde)) {
                                return proyecto //pago 
                            }
                        });
                    }

                    if (filtros.fecha_pago_hasta) {
                        proyecto.egresos.map(egreso => {
                            if ((formatFechaISO(egreso.fecha_pago) <= formatFechaISO(filtros.fecha_pago_hasta))
                                || (formatFechaISO(egreso.fecha_diferido_pago) <= formatFechaISO(filtros.fecha_pago_hasta))) {
                                return proyecto //pago 
                            }
                        });
                    }
                }
                
                /*if (filtros.fecha_cobro_hasta || filtros.fecha_cobro_desde) {
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
            })*/

            console.log(resultadoFiltroProyecto)

            if (resultadoFiltroProyecto.length > 0) { /*Nos aseguramos de tener resultados */
                state.proyectos = resultadoFiltroProyecto;
            } else if (resultadoFiltroProyecto.length <= 0 && filtros) {
                /*Si no se obtenieron resultados y exisen filtros muestra una alerta de que no se encontraron los resultados 
                y se resetean los proyectos que se muestran */
                ToastComponent('warn', 'No se encontraron resultados');
                state.proyectos = proyectos;
            }
        },
        deleteFiltros: (state, action) => {

        },
        activeLoading: (state, action) => {
            state.loading = action.payload;
        },
        activeError: (state, action) => {
            state.error = true;
        }
    }
})

export const { setProyectos, addFiltros, activeLoading, activeError, deleteFiltros } = proyectoSlice.actions;

export default proyectoSlice.reducer;