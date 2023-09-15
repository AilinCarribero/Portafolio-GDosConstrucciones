import React from 'react';
import ReactApexChart from 'react-apexcharts';

//Hooks
import { formatFecha } from '../../../hooks/useUtils';

const GraficTrazabilidadCliente = ({ proyectos }) => {
    /*Inicio de configuracion de grafica */
    const options = {
        chart: {
            height: 'auto',
            type: 'rangeBar',
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '15%',
                rangeBarGroupRows: true
            }
        },
        colors: [ "#9FCBD0", "#3BC9DB", "#3E787F", "#35494B", "#282F2F", "#1C1F1F", "#141515", "#0E0E0E" ],
        fill: {
            type: 'solid'
        },
        xaxis: {
            type: 'datetime'
        },
        legend: {
            show: false,
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

    const formatDataTimeLine = (proyectos) => {
        return proyectos.map(proyecto => {
            return {
                name: proyecto.id_proyecto,
                data: [
                    {
                        x: ' ',
                        y: [
                            new Date(proyecto.fecha_i_proyecto).getTime(),
                            new Date(proyecto.fecha_f_proyecto).getTime() || new Date().getTime()
                        ]
                    }
                ]
            }
        })
    }
    /* Finalizacion de config de grafica */
    return (<>
        <ReactApexChart series={formatDataTimeLine(proyectos)} options={options} type="rangeBar" height={120} />
    </>)
}

export default React.memo(GraficTrazabilidadCliente)