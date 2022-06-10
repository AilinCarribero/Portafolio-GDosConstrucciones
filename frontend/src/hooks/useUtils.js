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
    //console.log(dateUTC, date.getUTCDate(), date.getFullYear(), date.getMonth(), date.getDate());
    const año = date.getFullYear();
    const dia = date.getUTCDate();
    const mes = dia == 1 ? (date.getMonth()+2 > 12 ? date.getMonth()+2 - 12 : date.getMonth()+2 ) : (date.getMonth()+1 > 12 ? date.getMonth()+1 - 12 : date.getMonth()+1);

    const fechaFormat = dia +'/'+ mes +'/'+ año;
//console.log(dateUTC, fechaFormat)
    return fechaFormat
}
