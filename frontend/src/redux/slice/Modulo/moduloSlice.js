import { createSlice } from "@reduxjs/toolkit";

export const moduloSlice = createSlice({
    name: 'modulo',
    initialState: {
        cantidades: [],
        loading: false,
        error: false
    },
    reducers: {
        setCantidadModulos: (state, action) => {
            state.cantidades = action.payload;
        },
        changeLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export const { setCantidadModulos, changeLoading } = moduloSlice.actions;

export default moduloSlice.reducer;