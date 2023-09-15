import React from 'react';
import ReactApexChart from 'react-apexcharts';

//Hooks
import { formatFecha } from '../../../hooks/useUtils';

const GraficTrazabilidadModulo = ({alquileres}) => {/*Inicio de configuracion de grafica */
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
            "#5E737E", "#536A9A", "#394349", "#23272A", "#23272A", "#558FB1",
            "#365364", "#212631", , "#354057", "#707092",
            "#444454", "#292931"
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

                return ('<div class="range-bar-tooltip"><div id="range-bar-tooltip-title">' + values + '</div> <div id="range-bar-tooltip-fecha">' + fromYear + ' al ' + toYear + ' </div></div>')
            }
        }
    }

    const formatDataTimeLine = (alquileres) => {
        return alquileres.map(alquiler => {
            return {
                name: alquiler.id_proyecto,
                data: [
                    {
                        x: ' ',
                        y: [
                            new Date(alquiler.fecha_d_alquiler).getTime(),
                            new Date(alquiler.fecha_h_alquiler).getTime() || new Date().getTime()
                        ]
                    }
                ]
            }
        })
    }
    /* Finalizacion de config de grafica */
    return (<>
        <ReactApexChart series={formatDataTimeLine(alquileres)} options={options} type="rangeBar" height={140} />
    </>)
}

export default React.memo(GraficTrazabilidadModulo)