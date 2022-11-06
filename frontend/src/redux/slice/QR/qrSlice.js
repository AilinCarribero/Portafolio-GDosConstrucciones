import { createSlice } from "@reduxjs/toolkit";

export const qrSlice = createSlice({
    name: 'qr',
    initialState: {
        urlQr: '',
        showModalUrlQr: false
    },
    reducers: {
        setShowModalQr: (state, action) => {
            state.urlQr = action.payload.url;
            state.showModalUrlQr = action.payload.show;
        },
        setCloseModalQr: (state, action) => {
            state.showModalUrlQr = action.payload;
        }
    }
})

export const { setShowModalQr, setCloseModalQr } = qrSlice.actions;

export default qrSlice.reducer;