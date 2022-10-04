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
    }
})

export const { setCantidadModulos } = moduloSlice.actions;

export default moduloSlice.reducer;