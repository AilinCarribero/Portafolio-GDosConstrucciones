import moment from 'moment';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { calcCantMeses, formatFecha } from '../../../hooks/useUtils';

const GraficIngresosAlquileres = ({ alquiler, ingresoAlquiler }) => {
    console.log(alquiler, ingresoAlquiler)
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
            theme: false,
            custom: function (opts) {
                const fromYear = formatFecha(opts.y1)
                const toYear = formatFecha(opts.y2)
                const values = opts.ctx.rangeBar.getTooltipValues(opts).seriesName;

                return ('<div class="range-bar-tooltip"><div id="range-bar-tooltip-title">' + values + '</div> <div id="range-bar-tooltip-fecha">' + fromYear + ' - ' + toYear + ' </div></div>')
            }
        }
    }

    const formatDataTimeLine = () => {
        const fechaAI = moment(alquiler.fecha_d_alquiler).add(1, 'days');
        const fechaAF = moment(alquiler.fecha_h_alquiler).add(1, 'days');

        const cantMes = calcCantMeses(alquiler.fecha_d_alquiler, alquiler.fecha_h_alquiler);

        let arrayTabla = [];

        let arrayTablaPagado = {
            name: "Pagado",
            data: []
        };

        let arrayTablaNoPagado = {
            name: "No Pagado",
            data: []
        };

        ingresoAlquiler.map(ingreso => {
            const fechaID = moment(ingreso.fecha_desde_cobro).add(1, 'days');
            const yearID = moment(ingreso.fecha_desde_cobro).add(1, 'days').get('year');
            const fechaIH = moment(ingreso.fecha_hasta_cobro).add(1, 'days');
            const yearIH = moment(ingreso.fecha_hasta_cobro).add(1, 'days').get('year');

            console.log(cantMes, yearID, yearIH, fechaAI.format("YYYY-MM"), fechaAF.format("YYYY-MM"))


            for (const fecha = moment(fechaAI); fecha.format("YYYY-MM") <= fechaAF.format("YYYY-MM"); fecha.add(1, 'months')) {
                const fI = moment(fecha);
                const fF = moment(fecha).add(1, 'months');

                //const verifyNoPagado = arrayTablaNoPagado.data.map(data => data.y[0] != new Date(fI).getTime() || data.y[1] == new Date(fI).getTime() || data.y[0] == new Date(fI).getTime() || data.y[1] != new Date(fF).getTime()).find(data => data == true);

                arrayTablaNoPagado.data.filter(data => console.log(data, data.y[0], new Date(fI).getTime(), data.y[0] == new Date(fI).getTime(), data.y[1], data.y[1] == new Date(fI).getTime()));

                if (fechaID.format("YYYY-MM") <= fechaIH.format("YYYY-MM") && fechaID.format("MM-YYYY") === fecha.format("MM-YYYY")) {
                    console.log('pagado',fI.format("DD-MM-YYYY"), new Date(fI))
                    
                    //arrayTablaNoPagado.data = arrayTablaNoPagado.data.filter(data => data.y[0] != new Date(fI).getTime() || data.y[1] == new Date(fI).getTime() || data.y[1] != new Date(fF).getTime()) || []

                    arrayTablaPagado.data.push({
                        x: fecha.get('year').toString(),
                        y: [
                            new Date(fI).getTime(),
                            new Date(fF).getTime()
                        ]
                    })

                    fechaID.add(1, 'months')

                } else {
                    console.log('no pagado', fI.format("DD-MM-YYYY"), new Date(fI));
                    //console.log('verifyNoPagado', verifyNoPagado)
                    arrayTablaNoPagado.data.push({
                        x: fecha.get('year').toString(),
                        y: [
                            new Date(fI).getTime(),
                            new Date(fF).getTime()
                        ]
                    });
                    /*if (!verifyNoPagado) {
                        console.log('>>verifyNoPagado')
                        arrayTablaNoPagado.data.push({
                            x: fecha.get('year').toString(),
                            y: [
                                new Date(fI).getTime(),
                                new Date(fF).getTime()
                            ]
                        });
                    } else {
                        arrayTablaNoPagado.data = arrayTablaNoPagado.data.filter(data => data.y[0] != new Date(fI).getTime() || data.y[1] == new Date(fI).getTime() || data.y[0] == new Date(fI).getTime() || data.y[1] != new Date(fF).getTime()) || []
                    }*/
                }

                arrayTablaNoPagado.data = arrayTablaNoPagado.data.filter(data => data.y[0] == new Date(fI).getTime() || data.y[1] == new Date(fI).getTime() /*|| data.y[1] != new Date(fI).getTime() || data.y[0] != new Date(fI).getTime() || data.y[1] != new Date(fF).getTime()*/)
                //console.log('fecha + 1', fechaID.format("DD-MM-YYYY"))
            }

        });

        arrayTabla.push(arrayTablaPagado);
        arrayTabla.push(arrayTablaNoPagado);
        console.log(arrayTablaPagado, arrayTablaNoPagado, arrayTabla)
        console.log('---------------------------------------------------')
        return arrayTabla;
    }
    /* Finalizacion de config de grafica */

    return (
        <ReactApexChart options={options} series={formatDataTimeLine()} type="rangeBar" height={200} />
    )
}

export default React.memo(GraficIngresosAlquileres)