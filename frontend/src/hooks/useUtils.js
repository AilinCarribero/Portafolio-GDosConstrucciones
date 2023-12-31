import moment from 'moment';
import { toast } from 'react-toastify';

//Formatea el numero que se le pasa en formato moneda con no mas de 2 decimales para ser mostrados
export const formatNumber = (numero) => {
    const numValido = numero ? parseFloat(numero) : 0;

    const numFormat = Intl.NumberFormat("ES-AR", {
        style: "decimal",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(numValido);

    return numFormat
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
export const formatFechaISO = (fecha) => {
    if (fecha) {
        const newFecha = new Date(fecha).toISOString().slice(0, 10);
        return newFecha;
    }
}

export const formatFecha = (fecha) => {
    const momentFecha = moment(fecha);
    let fechaFormat = '';

    if (fecha.length > 10) {
        fechaFormat = momentFecha.add(1, 'days').format("DD-MM-YYYY");
    } else {
        fechaFormat = momentFecha.format("DD-MM-YYYY");
    }

    return fechaFormat
}

export const formatTextMix = (text) => {
    if (text && typeof text === 'string') {
        const letra1 = text.charAt(0); //Obtenemos la primer letra del texto
        const letraResto = text.slice(1); //Obtenemos el resto de las letras

        //Formateamos la primer letra a MAYUSCULA y el resto del texto en minuscula volviendo a unir todo
        const newText = letra1.toUpperCase() + letraResto.toLowerCase();
        return newText.replace(/-/g, " ");
    } else {
        return text;
    }
}

export const calcularValorXMes = (fechaInicio, cantMeses, valorXMes) => {
    const fecha = fechaInicio instanceof Object ? fechaInicio : moment(fechaInicio);

    const limitFor = cantMeses ? cantMeses : 1;

    const yearHere = new Date().getFullYear();
    const monthHere = new Date().getMonth();

    let enero = 0;
    let febrero = 0;
    let marzo = 0;
    let abril = 0;
    let mayo = 0;
    let junio = 0;
    let julio = 0;
    let agosto = 0;
    let septiembre = 0;
    let octubre = 0;
    let noviembre = 0;
    let diciembre = 0;

    /* Los meses van del 0 al 11 */
    for (let i = 0; i < limitFor; i++) {
        /* En caso de que el año sea igual al actual pasa directo sino tiene que ver que el mes del siguiente año sea menor al mes anterior al actual 
        Esto se hace para verificar que no estamos mostrando un valor que no se va a cobrar al mes actual ya que corresponde al mismo mes pero de otro año*/
        if (fecha.get('year') === yearHere || (yearHere < fecha.get('year') && fecha.get('month') < (monthHere - 1))) {
            //console.log('año fecha ',fecha.get('year'), 'año actual ', yearHere, 'mes fecha', fecha.get('month'), 'mes actual', monthHere)
            switch (fecha.get('month')) {
                case 0:
                    //console.log('enero');
                    enero += valorXMes;
                    break;
                case 1:
                    //console.log('febrero');
                    febrero += valorXMes;
                    break;
                case 2:
                    //console.log('marzo');
                    marzo += valorXMes;
                    break;
                case 3:
                    //console.log('abril');
                    abril += valorXMes;
                    break;
                case 4:
                    //console.log('mayo');
                    mayo += valorXMes;
                    break;
                case 5:
                    //console.log('junio');
                    junio += valorXMes;
                    break;
                case 6:
                    //console.log('julio');
                    julio += valorXMes;
                    break;
                case 7:
                    //console.log('agosto');
                    agosto += valorXMes;
                    break;
                case 8:
                    //console.log('septiembre');
                    septiembre += valorXMes;
                    break;
                case 9:
                    //console.log('octubre');
                    octubre += valorXMes;
                    break;
                case 10:
                    //console.log('noviembre');
                    noviembre += valorXMes;
                    break;
                case 11:
                    //console.log('diciembre');
                    diciembre += valorXMes;
                    break;
            }
        }

        fecha.add(1, 'months').get('month');
    }

    return ({
        enero: enero,
        febrero: febrero,
        marzo: marzo,
        abril: abril,
        mayo: mayo,
        junio: junio,
        julio: julio,
        agosto: agosto,
        septiembre: septiembre,
        octubre: octubre,
        noviembre: noviembre,
        diciembre: diciembre,
    })
}

export const formatNameMes = (numMes) => {
    switch (numMes) {
        case -1:
            return 'diciembre';
        case 0:
            return 'enero';
        case 1:
            return 'febrero';
        case 2:
            return 'marzo';
        case 3:
            return 'abril';
        case 4:
            return 'mayo';
        case 5:
            return 'junio';
        case 6:
            return 'julio';
        case 7:
            return 'agosto';
        case 8:
            return 'septiembre';
        case 9:
            return 'octubre';
        case 10:
            return 'noviembre';
        case 11:
            return 'diciembre';
        case 12:
            return 'enero';
    }
}

export const calcDifDias = (inicio, fin) => {
    const fechaDesde = moment(inicio);
    const fechaHasta = moment(fin);

    const cantMeses = fechaHasta.diff(fechaDesde, 'days') + 1 > 0 ? fechaHasta.diff(fechaDesde, 'days') + 1 : 0;

    return cantMeses;
}

export const calcCantMeses = (desde, hasta) => {
    const fechaDesde = moment(desde).format("YYYY-MM");
    const fechaHasta = hasta ? moment(hasta).format("YYYY-MM") : fechaDesde;

    const cantMeses = Math.ceil(moment(fechaHasta).diff(fechaDesde, 'month') + 1);

    return cantMeses === 0 ? 1 : cantMeses;
}