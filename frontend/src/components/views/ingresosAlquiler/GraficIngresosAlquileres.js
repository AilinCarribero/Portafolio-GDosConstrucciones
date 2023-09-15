import moment from 'moment';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

//Hooks
import { calcCantMeses, formatFecha, formatNumber } from '../../../hooks/useUtils';

const GraficIngresosAlquileres = ({ alquiler, ingresoAlquiler }) => {
    const cantMeses = calcCantMeses(alquiler.fecha_d_alquiler, alquiler.fecha_h_alquiler);

    const valXMesAlquiler = formatNumber(alquiler.valor / cantMeses);
    /*Inicio de configuracion de grafica */
    const options = {
        chart: {
            height: 10,
            type: 'rangeBar'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '20%',
                rangeBarGroupRows: true
            }
        },
        colors: [
            "#05be40", "#c20000",
        ],
        fill: {
            type: 'solid'
        },
        xaxis: {
            type: 'datetime'
        },
        legend: {
            position: 'right'
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            custom: function (opts) {
                const fromYear = formatFecha(opts.y1)
                const toYear = formatFecha(opts.y2)
                const values = opts.w.globals.seriesNames[opts.seriesIndex];

                return (
                    `<div class="range-bar-tooltip">
                        <div id="range-bar-tooltip-title"> ${values} </div> 
                        <div id="range-bar-tooltip-fecha"> ${fromYear} al ${toYear}</div>
                        <div id="range-bar-tooltip-fecha"> Valor: $${valXMesAlquiler}</div>
                    </div>`)
            }
        }
    }

    const formatDataTimeLine = () => {
        const fechaAI = moment(alquiler.fecha_d_alquiler).add(1, 'days'); //Inicio alquiler
        const fechaAF = moment(alquiler.fecha_h_alquiler).add(1, 'days'); //Final alquiler

        let arrayTabla = [];

        let arrayTablaPagado = {
            name: "Pagado",
            data: []
        };

        let arrayTablaNoPagado = {
            name: "No Pagado",
            data: []
        };

        ingresoAlquiler.forEach(ingreso => {
            const fechaID = moment(ingreso.fecha_desde_cobro).add(1, 'days'); //Ingreso desde 
            const fechaIH = moment(ingreso.fecha_hasta_cobro).add(1, 'days'); //Ingreso hasta

            for (const fechaFor = moment(fechaAI.format("YYYY-MM")); fechaFor.format("YYYY-MM") <= fechaAF.format("YYYY-MM"); fechaFor.add(1, 'months')) {
                const fI = moment(fechaFor);
                const fF = moment(fechaFor).add(1, 'months');

                /*Si fecha de inicio es menor o igual a la fecha final y la fecha de inicio es igual a la fecha del for */
                if (fechaID.format("YYYY-MM") <= fechaIH.format("YYYY-MM") && fechaID.format("MM-YYYY") === fechaFor.format("MM-YYYY")) {
                    arrayTablaPagado.data.push({
                        x: fechaFor.get('year').toString(),
                        y: [
                            new Date(fI).getTime(),
                            new Date(fF).getTime()
                        ]
                    });

                    fechaID.add(1, 'months')
                } else {
                    let flag = true;

                    arrayTablaPagado.data.forEach(dataP => {
                        const dataFormatPY0 = moment(dataP.y[0]).format("YYYY-MM");
                        const dataFormatPY1 = moment(dataP.y[1]).format("YYYY-MM");

                        if (fI.format("YYYY-MM") == dataFormatPY0 || fF.format("YYYY-MM") == dataFormatPY1) {
                            flag = false;
                        }
                    });

                    arrayTablaNoPagado.data.forEach((dataNoP, i) => {
                        const dataFormatNPY0 = moment(dataNoP.y[0]).format("YYYY-MM");
                        const dataFormatNPY1 = moment(dataNoP.y[1]).format("YYYY-MM");

                        if (fI.format("YYYY-MM") == dataFormatNPY0 || fF.format("YYYY-MM") == dataFormatNPY1) {
                            flag = false;
                        }
                    });

                    if (flag) {
                        arrayTablaNoPagado.data.push({
                            x: fechaFor.get('year').toString(),
                            y: [
                                new Date(fI).getTime(),
                                new Date(fF).getTime()
                            ]
                        });
                    }
                }
            }
        });

        arrayTablaPagado.data.forEach(dataP => {
            const dataFormatPY0 = moment(dataP.y[0]).format("YYYY-MM");
            const dataFormatPY1 = moment(dataP.y[1]).format("YYYY-MM");

            arrayTablaNoPagado.data.forEach((dataNoP, i) => {
                const dataFormatNPY0 = moment(dataNoP.y[0]).format("YYYY-MM");
                const dataFormatNPY1 = moment(dataNoP.y[1]).format("YYYY-MM");

                if (dataFormatNPY0 === dataFormatPY0 || dataFormatNPY1 === dataFormatPY1) {
                    arrayTablaNoPagado.data.splice(i, 1)
                }
            })
        });

        arrayTabla = [arrayTablaPagado, arrayTablaNoPagado];

        return arrayTabla;
    }
    /* Finalizacion de config de grafica */

    return (
        <ReactApexChart options={options} series={formatDataTimeLine()} type="rangeBar" height={200} />
    )
}

export default React.memo(GraficIngresosAlquileres)