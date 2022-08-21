import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: false,
    reducers: {
        changeLoading: (state, action) => {
            state.push(action.payload);
        }
    }
})

export const { changeLoading } = loadingSlice.actions;

export default loadingSlice.reducer;