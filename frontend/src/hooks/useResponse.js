import React from "react";

export const useResponse = () => {

    const response = (respuesta) => {
        return respuesta && !respuesta.data.todoMal && (respuesta.data.todoOk == 'Ok' || respuesta.statusText == 'OK' || respuesta.status == 200)
    }

    return { response }
}