import Decimal from "decimal.js-light";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAlquileresId } from "../services/apiAlquileres";
import { calcCantMeses, calcularValorXMes } from "./useUtils";

export const useGetAlquileresId = (id) => {
    const [alquileres, setAlquileres] = useState([]);
    const [mesAlquiler, setMesAlquiler] = useState([]);
    const [totalAlquiler, setTotalAlquiler] = useState([]);

    /*useEffect(() => {
        (async () => {
            const resAlquileres = await getAlquileresId(id);
            cobroMensual(resAlquileres);
            setAlquileres(resAlquileres);
        })()
    }, [])*/

    const cobroMensual = (alquileres) => {
        let total = 0;
        let auxTotalesXMes = {
            enero: 0,
            febrero: 0,
            marzo: 0,
            abril: 0,
            mayo: 0,
            junio: 0,
            julio: 0,
            agosto: 0,
            septiembre: 0,
            octubre: 0,
            noviembre: 0,
            diciembre: 0,
        }

        alquileres.map(alquiler => {
            const fechaDesde = moment(alquiler.fecha_d_alquiler);
            const fechaHasta = moment(alquiler.fecha_h_alquiler);

            const cantMeses = Math.abs(fechaHasta.diff(fechaDesde, 'month'));
            const valorXMes = cantMeses ? new Decimal(alquiler.valor).div(cantMeses).toNumber() : alquiler.valor;

            const valorTotalXMes = calcularValorXMes(fechaDesde, cantMeses, valorXMes);

            total = new Decimal(total).add(alquiler.valor).toNumber();

            auxTotalesXMes = {
                enero: new Decimal(auxTotalesXMes.enero).add(valorTotalXMes.enero).toNumber(),
                febrero: new Decimal(auxTotalesXMes.febrero).add(valorTotalXMes.febrero).toNumber(),
                marzo: new Decimal(auxTotalesXMes.marzo).add(valorTotalXMes.marzo).toNumber(),
                abril: new Decimal(auxTotalesXMes.abril).add(valorTotalXMes.abril).toNumber(),
                mayo: new Decimal(auxTotalesXMes.mayo).add(valorTotalXMes.mayo).toNumber(),
                junio: new Decimal(auxTotalesXMes.junio).add(valorTotalXMes.junio).toNumber(),
                julio: new Decimal(auxTotalesXMes.julio).add(valorTotalXMes.julio).toNumber(),
                agosto: new Decimal(auxTotalesXMes.agosto).add(valorTotalXMes.agosto).toNumber(),
                septiembre: new Decimal(auxTotalesXMes.septiembre).add(valorTotalXMes.septiembre).toNumber(),
                octubre: new Decimal(auxTotalesXMes.octubre).add(valorTotalXMes.octubre).toNumber(),
                noviembre: new Decimal(auxTotalesXMes.noviembre).add(valorTotalXMes.noviembre).toNumber(),
                diciembre: new Decimal(auxTotalesXMes.diciembre).add(valorTotalXMes.diciembre).toNumber()
            }
        });

        setTotalAlquiler(total);
        setMesAlquiler(auxTotalesXMes);
    }

    const CalcMesesAlquiler = (inicio, fin) => {
        const fechaDesde = moment(inicio);
        const fechaHasta = moment(fin);

        const cantMeses = calcCantMeses(fechaDesde, fechaHasta);

        return cantMeses === 0 ? 1 : cantMeses;
    }

    return { alquileres, mesAlquiler, totalAlquiler, CalcMesesAlquiler, setAlquileres }
}

export const useAlquileres = () => {
    const yearHere = new Date().getFullYear();
    const monthHere = new Date().getMonth();

    const ingresoAlquilerXMes = (ingresos) => {
        if (ingresos.length > 0) {
            let mes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            ingresos.map(ingreso => {
                const inicioPago = ingreso.fecha_desde_cobro;
                const finPago = ingreso.fecha_hasta_cobro;

                const fecha = moment(inicioPago).add(1, 'days');

                const fechaDesde = moment(inicioPago);
                const fechaHasta = moment(finPago);

                const cantMeses = calcCantMeses(fechaDesde, fechaHasta);

                for (let i = 0; i < cantMeses; i++) {
                    /* En caso de que el año sea igual al actual pasa directo sino tiene que ver que el mes del siguiente año sea menor al mes anterior al actual 
                    Esto se hace para verificar que no estamos mostrando un valor que no se va a cobrar al mes actual ya que corresponde al mismo mes pero de otro año*/
                    if (fecha.get('year') === yearHere || (yearHere < fecha.get('year') && fecha.get('month') < (monthHere - 1))) {
                        
                        const month = fecha.get('month') + 1;

                        switch (month) {
                            case 1:
                                mes[0] += 1;
                                break;
                            case 2:
                                mes[1] += 1;
                                break;
                            case 3:
                                mes[2] += 1;
                                break;
                            case 4:
                                mes[3] += 1;
                                break;
                            case 5:
                                mes[4] += 1;
                                break;
                            case 6:
                                mes[5] += 1;
                                break;
                            case 7:
                                mes[6] += 1;
                                break;
                            case 8:
                                mes[7] += 1;
                                break;
                            case 9:
                                mes[8] += 1;
                                break;
                            case 10:
                                mes[9] += 1;
                                break;
                            case 11:
                                mes[10] += 1;
                                break;
                            case 12:
                                mes[11] += 1;
                                break;
                        }
                    }
                    
                    fecha.add(1, 'months').get('month');
                }
            });

            return mes;
        }

        return [];
    }

    return { ingresoAlquilerXMes, yearHere, monthHere }
}