import { createSlice } from "@reduxjs/toolkit";

//Hooks
import { formatFechaISO, ToastComponent } from "../../../hooks/useUtils";

export const proyectoSlice = createSlice({
    name: 'proyecto',
    initialState: {
        filtros: [],
        proyectos: [],
        alquilerXMes: [],
        totalAlquieres: 0,
        totalVigente: 0,
        loading: false,
        error: false
    },
    reducers: {
        setProyectos: (state, action) => {
            state.proyectos = action.payload.proyectos;
            state.alquilerXMes = action.payload.totalAlquileresXMes;
            state.totalAlquieres = action.payload.totalAlquileres;
            state.totalVigente = action.payload.totalVigente;

            state.loading = false;
        },
        changeFiltros: (state, action) => {
            const newFiltro = action.payload;
            const oldFiltros = state.filtros;

            state.filtros = { ...oldFiltros, ...newFiltro };

            const filtros = state.filtros;
            const proyectos = state.proyectos;

            let resultadoFiltroProyecto = proyectos;

            /*
                1er filtro -> si existe el filtro fecha_cobro_desde va a filtrar
                2do filtro -> si existe el filtro fecha_cobro_hasta filtra los proyectos disponibles
                ...
            */
            if (filtros.fecha_cobro_desde) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (formatFechaISO(proyecto.ingresos[i].fecha_cobro) >= formatFechaISO(filtros.fecha_cobro_desde)) {
                                return proyecto //cobro 
                            }

                            if (formatFechaISO(proyecto.ingresos[i].fecha_diferido_cobro) >= formatFechaISO(filtros.fecha_cobro_desde)) {
                                return proyecto //cobro 
                            }
                        }
                    }
                });
            }

            if (filtros.fecha_cobro_hasta) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (formatFechaISO(proyecto.ingresos[i].fecha_cobro) <= formatFechaISO(filtros.fecha_cobro_hasta)) {
                                return proyecto //cobro 
                            }

                            if (formatFechaISO(proyecto.ingresos[i].fecha_diferido_cobro) <= formatFechaISO(filtros.fecha_cobro_hasta)) {
                                return proyecto //cobro 
                            }
                        }
                    }
                });
            }

            if (filtros.fecha_pago_desde) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (formatFechaISO(proyecto.egresos[i].fecha_pago) >= formatFechaISO(filtros.fecha_pago_desde)) {
                                return proyecto //pago 
                            }

                            if (formatFechaISO(proyecto.egresos[i].fecha_diferido_pago) >= formatFechaISO(filtros.fecha_pago_desde)) {
                                return proyecto //pago 
                            }
                        }
                    }
                });
            }

            if (filtros.fecha_pago_hasta) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (formatFechaISO(proyecto.egresos[i].fecha_pago) <= formatFechaISO(filtros.fecha_pago_hasta)) {
                                return proyecto //pago 
                            }

                            if (formatFechaISO(proyecto.egresos[i].fecha_diferido_pago) <= formatFechaISO(filtros.fecha_pago_hasta)) {
                                return proyecto //pago 
                            }
                        }
                    }
                });
            }

            if (resultadoFiltroProyecto.length > 0) { 
                /*Nos aseguramos de tener resultados */
                state.proyectos = resultadoFiltroProyecto;
            } else if (resultadoFiltroProyecto.length <= 0 && filtros) {
                /*Si no se obtenieron resultados y exisen filtros muestra una alerta de que no se encontraron los resultados 
                y se resetean los proyectos que se muestran */
                ToastComponent('warn', 'No se encontraron resultados');
                state.proyectos = proyectos;
            }
        },
        removeFiltros: (state, action) => {
            const proyectos = action.payload.proyectos;
            const filtros = state.filtros;

            //Eliminamos el filtro que se solicito eliminar
            delete filtros[action.payload.filtro];
            
            let resultadoFiltroProyecto = proyectos;

            if (filtros.fecha_cobro_desde) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (formatFechaISO(proyecto.ingresos[i].fecha_cobro) >= formatFechaISO(filtros.fecha_cobro_desde)) {
                                return proyecto //cobro 
                            }

                            if (formatFechaISO(proyecto.ingresos[i].fecha_diferido_cobro) >= formatFechaISO(filtros.fecha_cobro_desde)) {
                                return proyecto //cobro 
                            }
                        }
                    }
                });
            }

            if (filtros.fecha_cobro_hasta) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.ingresos.length > 0) {
                        for (let i = 0; i < proyecto.ingresos.length; i++) {
                            if (formatFechaISO(proyecto.ingresos[i].fecha_cobro) <= formatFechaISO(filtros.fecha_cobro_hasta)) {
                                return proyecto //cobro 
                            }

                            if (formatFechaISO(proyecto.ingresos[i].fecha_diferido_cobro) <= formatFechaISO(filtros.fecha_cobro_hasta)) {
                                return proyecto //cobro 
                            }
                        }
                    }
                });
            }

            if (filtros.fecha_pago_desde) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (formatFechaISO(proyecto.egresos[i].fecha_pago) >= formatFechaISO(filtros.fecha_pago_desde)) {
                                return proyecto //pago 
                            }

                            if (formatFechaISO(proyecto.egresos[i].fecha_diferido_pago) >= formatFechaISO(filtros.fecha_pago_desde)) {
                                return proyecto //pago 
                            }
                        }
                    }
                });
            }

            if (filtros.fecha_pago_hasta) {
                resultadoFiltroProyecto = resultadoFiltroProyecto.filter(proyecto => {
                    if (proyecto.egresos.length > 0) {
                        for (let i = 0; i < proyecto.egresos.length; i++) {
                            if (formatFechaISO(proyecto.egresos[i].fecha_pago) <= formatFechaISO(filtros.fecha_pago_hasta)) {
                                return proyecto //pago 
                            }

                            if (formatFechaISO(proyecto.egresos[i].fecha_diferido_pago) <= formatFechaISO(filtros.fecha_pago_hasta)) {
                                return proyecto //pago 
                            }
                        }
                    }
                });
            }

            if (resultadoFiltroProyecto.length > 0) { 
                /*Nos aseguramos de tener resultados */
                state.proyectos = resultadoFiltroProyecto;
            } else if (resultadoFiltroProyecto.length <= 0 && filtros) {
                /*Si no se obtenieron resultados y exisen filtros muestra una alerta de que no se encontraron los resultados 
                y se resetean los proyectos que se muestran */
                ToastComponent('warn', 'No se encontraron resultados');
                state.proyectos = proyectos;
            }
        },
        activeLoading: (state, action) => {
            state.loading = action.payload;
        },
        activeError: (state, action) => {
            state.error = true;
        }
    }
})

export const { setProyectos, changeFiltros, activeLoading, activeError, removeFiltros } = proyectoSlice.actions;

export default proyectoSlice.reducer;