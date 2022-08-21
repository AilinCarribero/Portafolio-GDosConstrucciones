import { configureStore } from '@reduxjs/toolkit';
import proyectoReducer from './slice/Proyecto/proyectoSlice';
import loadingReducer from './slice/Loading/loadingSlice';

export const store = configureStore({
    reducer: {
        proyectoRedux: proyectoReducer,
        loadingRedux: loadingReducer
    }
});
