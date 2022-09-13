import Decimal from "decimal.js-light";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAlquileresId } from "../services/apiAlquileres";
import { calcularValorXMes } from "./useUtils";

export const useGetAlquileresId = (id) => {
    const [alquileres, setAlquileres] = useState([]);
    const [mesAlquiler, setMesAlquiler] = useState([]);
    const [totalAlquiler, setTotalAlquiler] = useState([]);

    useEffect(() => {
        (async () => {
            const resAlquileres = await getAlquileresId(id);
            cobroMensual(resAlquileres);
            setAlquileres(resAlquileres);
        })()
    }, [])

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
            setiembre: 0,
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
                setiembre: new Decimal(auxTotalesXMes.setiembre).add(valorTotalXMes.setiembre).toNumber(),
                octubre: new Decimal(auxTotalesXMes.octubre).add(valorTotalXMes.octubre).toNumber(),
                noviembre: new Decimal(auxTotalesXMes.noviembre).add(valorTotalXMes.noviembre).toNumber(),
                diciembre: new Decimal(auxTotalesXMes.diciembre).add(valorTotalXMes.diciembre).toNumber()
            }
        });

        setTotalAlquiler(total);
        setMesAlquiler(auxTotalesXMes);
    }

    return { alquileres, mesAlquiler, totalAlquiler, setAlquileres }
}