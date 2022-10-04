import { configureStore } from '@reduxjs/toolkit';
import proyectoReducer from './slice/Proyecto/proyectoSlice';
import loadingReducer from './slice/Loading/loadingSlice';
import moduloReducer from './slice/Modulo/moduloSlice';

export const store = configureStore({
    reducer: {
        proyectoRedux: proyectoReducer,
        loadingRedux: loadingReducer,
        moduloRedux: moduloReducer
    }
});
