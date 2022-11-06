import { toast } from 'react-toastify';

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