import React from "react";

export const useResponse = () => {

    const response = (respuesta) => {
        if(!respuesta.data.errors && respuesta && !respuesta.data.todoMal && (respuesta.data.todoOk == 'Ok' || respuesta.statusText == 'OK' || respuesta.status == 200)){
            return true
        } else {
            return false
        }
    }

    return { response }
}