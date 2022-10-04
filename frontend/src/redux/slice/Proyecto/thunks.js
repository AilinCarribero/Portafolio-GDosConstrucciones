import Decimal from "decimal.js-light";
import moment from "moment";
import { useSelector } from "react-redux";
import { calcularValorXMes } from "../../../hooks/useUtils";
import { getApiProyectos } from "../../../services/apiProyectos";
import { setProyectos, changeFiltros, activeLoading, removeFiltros } from "./proyectoSlice";

export const getProyectos = () => (dispatch) => {
    dispatch(activeLoading(true));

    getApiProyectos().then(proyectos => {
        let totalAlquileres = 0;
        let totalVigente = 0;
        let totalAlquileresXMes = {
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

        proyectos.map(proyecto => {
            if (proyecto.alquilers.length > 0) {
                let total = 0;
                let auxTotalesXMesXProyecto = {
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

                proyecto.alquilers.map(alquiler => {
                    const fechaDesde = moment(alquiler.fecha_d_alquiler);
                    const fechaHasta = moment(alquiler.fecha_h_alquiler);

                    const cantMeses = Math.ceil(fechaHasta.diff(fechaDesde, 'month'));

                    const valorXMes = cantMeses ? new Decimal(alquiler.valor).div(cantMeses).toNumber() : alquiler.valor;

                    const valorTotalXMes = calcularValorXMes(fechaDesde, cantMeses, valorXMes);

                    total = new Decimal(total).add(alquiler.valor).toNumber();

                    if(new Date(alquiler.fecha_d_alquiler) <= new Date() && new Date() <= new Date(alquiler.fecha_h_alquiler)) {
                        totalVigente = new Decimal(totalVigente).add(alquiler.valor).toNumber();
                    }

                    auxTotalesXMesXProyecto = {
                        enero: new Decimal(auxTotalesXMesXProyecto.enero).add(valorTotalXMes.enero).toNumber(),
                        febrero: new Decimal(auxTotalesXMesXProyecto.febrero).add(valorTotalXMes.febrero).toNumber(),
                        marzo: new Decimal(auxTotalesXMesXProyecto.marzo).add(valorTotalXMes.marzo).toNumber(),
                        abril: new Decimal(auxTotalesXMesXProyecto.abril).add(valorTotalXMes.abril).toNumber(),
                        mayo: new Decimal(auxTotalesXMesXProyecto.mayo).add(valorTotalXMes.mayo).toNumber(),
                        junio: new Decimal(auxTotalesXMesXProyecto.junio).add(valorTotalXMes.junio).toNumber(),
                        julio: new Decimal(auxTotalesXMesXProyecto.julio).add(valorTotalXMes.julio).toNumber(),
                        agosto: new Decimal(auxTotalesXMesXProyecto.agosto).add(valorTotalXMes.agosto).toNumber(),
                        septiembre: new Decimal(auxTotalesXMesXProyecto.septiembre).add(valorTotalXMes.septiembre).toNumber(),
                        octubre: new Decimal(auxTotalesXMesXProyecto.octubre).add(valorTotalXMes.octubre).toNumber(),
                        noviembre: new Decimal(auxTotalesXMesXProyecto.noviembre).add(valorTotalXMes.noviembre).toNumber(),
                        diciembre: new Decimal(auxTotalesXMesXProyecto.diciembre).add(valorTotalXMes.diciembre).toNumber()
                    }


                });

                proyecto.totalAlquiler = total;
                proyecto.totalAlquilerXMes = auxTotalesXMesXProyecto;

                totalAlquileres = new Decimal(totalAlquileres).add(total).toNumber();
                totalAlquileresXMes = {
                    enero: new Decimal(totalAlquileresXMes.enero).add(auxTotalesXMesXProyecto.enero).toNumber(),
                    febrero: new Decimal(totalAlquileresXMes.febrero).add(auxTotalesXMesXProyecto.febrero).toNumber(),
                    marzo: new Decimal(totalAlquileresXMes.marzo).add(auxTotalesXMesXProyecto.marzo).toNumber(),
                    abril: new Decimal(totalAlquileresXMes.abril).add(auxTotalesXMesXProyecto.abril).toNumber(),
                    mayo: new Decimal(totalAlquileresXMes.mayo).add(auxTotalesXMesXProyecto.mayo).toNumber(),
                    junio: new Decimal(totalAlquileresXMes.junio).add(auxTotalesXMesXProyecto.junio).toNumber(),
                    julio: new Decimal(totalAlquileresXMes.julio).add(auxTotalesXMesXProyecto.julio).toNumber(),
                    agosto: new Decimal(totalAlquileresXMes.agosto).add(auxTotalesXMesXProyecto.agosto).toNumber(),
                    septiembre: new Decimal(totalAlquileresXMes.septiembre).add(auxTotalesXMesXProyecto.septiembre).toNumber(),
                    octubre: new Decimal(totalAlquileresXMes.octubre).add(auxTotalesXMesXProyecto.octubre).toNumber(),
                    noviembre: new Decimal(totalAlquileresXMes.noviembre).add(auxTotalesXMesXProyecto.noviembre).toNumber(),
                    diciembre: new Decimal(totalAlquileresXMes.diciembre).add(auxTotalesXMesXProyecto.diciembre).toNumber()
                }
                
            }
        });

        const payload = {
            proyectos: proyectos,
            totalAlquileres: totalAlquileres,
            totalAlquileresXMes: totalAlquileresXMes,
            totalVigente: totalVigente
        }

        dispatch(setProyectos(payload));
    }).catch(err => {
        console.error(err);
    });
}

export const removeOneFiltro = (filtro) => (dispatch) => {
    dispatch(activeLoading(true));

    getApiProyectos().then(proyectos => {
        dispatch(removeFiltros({
            filtro: filtro,
            proyectos: proyectos
        }))
    }).catch(err => {
        console.error(err);
    });
}