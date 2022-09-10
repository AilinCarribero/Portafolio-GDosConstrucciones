import { toast } from 'react-toastify';

//Formatea el numero que se le pasa en formato moneda con no mas de 2 decimales para ser mostrados
export const formatNumber = (numero) => {
    const numValido = numero ? numero : 0;
    return new Intl.NumberFormat("ES-AR", {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(numValido)
}

/* Desformatea el numero para ser enviado en un formato que el sistema entienda */
export const desformatNumber = (number) => {
    let newNumber = number.toString();
    newNumber = newNumber.replace(/\./g, '');
    newNumber = newNumber.replace(/\,/g, '.');
    newNumber = parseFloat(newNumber);
    
    return newNumber;
}

//Activa un toast acorde al estado que se le pasa. Se le puede asignar un mensaje o usar el predeterminado.
export const ToastComponent = (estado, mensaje) => {
    const customId = 1; //Esto es para que solo exista un toast a la vez

    estado == 'warn' && toast.warn(
        mensaje ? mensaje : "Completa todos los campos",
        { theme: "dark", autoClose: 5000, toastId: customId }
    );
    estado == 'error' && toast.error(
        mensaje ? mensaje : "No se pudo enviar",
        { theme: "dark", autoClose: 5000, toastId: customId }
    );
    estado == 'success' && toast.success(
        mensaje ? mensaje : "Se envió con éxito!",
        { theme: "dark", autoClose: 5000, toastId: customId }
    );
}

//Formatea la fecha para mostrarse en el orden dd-mm-aaaa
export const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const dateUTC = date.toISOString();
    
    const dia = date.getUTCDate();
    const mes = dia == 1 ? (date.getMonth()+2 > 12 ? date.getMonth()+2 - 12 : date.getMonth()+2 ) : (date.getMonth()+1 > 12 ? date.getMonth()+1 - 12 : date.getMonth()+1);
    //Si mes es 1 y dia es 1 entonces hay que sumarle 1 al año
    const año = mes == 1 && dia == 1 ? date.getFullYear() + 1 : date.getFullYear();

    const fechaFormat = dia +'/'+ mes +'/'+ año;

    return fechaFormat
}

export const formatFechaISO = (fecha) => {
    const newFecha = new Date(fecha).toISOString().slice(0, 10);
    return newFecha;
}

export const formatTextMix = (text) => {
    if(text && typeof text === 'string'){
        const letra1 = text.charAt(0); //Obtenemos la primer letra del texto
        const letraResto = text.slice(1); //Obtenemos el resto de las letras

        //Formateamos la primer letra a MAYUSCULA y el resto del texto en minuscula volviendo a unir todo
        const newText = letra1.toUpperCase() + letraResto.toLowerCase();
        return newText.replace(/-/g, " ");
    } else {
        return text;
    }
}