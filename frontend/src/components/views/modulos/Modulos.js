import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';
import ReactApexCharts from 'react-apexcharts';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import Alerta from '../../utils/modal/validacion/Alerta';
import ModalVenta from './ModalVenta';

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';
import { useUser } from '../../../hooks/useUser';


//Servise
import { setVendido } from '../../../services/apiModulos';

//Css
import '../../../style/Modulos.scss';
import './Modulos.css';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const Modulos = () => {
    const { user } = useUser();
    const { modulos, setModulos } = useGetModulos();

    const [infoModalVenta, setInfoModalVenta] = useState({
        titulo: '',
        mensaje: ''
    })

    const [cantModulos, setCantModulos] = useState({
        total: 0,
        disponibles: 0,
        ocupados: 0,
        vendidos: 0
    })

    const [idModulo, setIdModulo] = useState();

    const [showForm, setShowForm] = useState(false);
    const [showModalVenta, setShowModalVenta] = useState(false);

    useEffect(() => {
        let auxDisponibles = 0;
        let auxOcupados = 0;
        let auxVendidos = 0;

        modulos.forEach(modulo => {
            switch (modulo.estado) {
                case 0:
                    auxDisponibles += 1;
                    break;
                case 1:
                    auxOcupados += 1;
                    break;
                case 2:
                    auxVendidos += 1;
                    break;
            }
        });

        setCantModulos({
            total: modulos.length,
            disponibles: auxDisponibles,
            ocupados: auxOcupados,
            vendidos: auxVendidos
        })

    }, [modulos])


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
            theme: false,
            custom: function (opts) {
                const fromYear = formatFecha(opts.y1)
                const toYear = formatFecha(opts.y2)
                const values = opts.ctx.rangeBar.getTooltipValues(opts).seriesName;

                return ('<div class="range-bar-tooltip"><div id="range-bar-tooltip-title">' + values + '</div> <div id="range-bar-tooltip-fecha">' + fromYear + ' - ' + toYear + ' </div></div>')
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
                            new Date(alquiler.fecha_h_alquiler).getTime()
                        ]
                    }
                ]
            }
        })
    }
    /* Finalizacion de config de grafica */

    const vender = async (data, id) => {
        id && setIdModulo(id);

        setInfoModalVenta({
            titulo: 'Vender Módulo',
        })
        setShowModalVenta(true);

        if (data && data.vender) {
            const dataSend = {
                id: idModulo,
                venta: data.valor
            }

            const response = await setVendido(dataSend);

            if (response.statusText == "OK" && response.status == 200) {
                setModulos(response.data)
            }
        }
    }

    return (<>
        <ModalFormulario formulario={'modulo'} show={showForm} setShow={setShowForm} updateNew={setModulos} />
        <ModalVenta titulo={infoModalVenta.titulo} show={showModalVenta} setShow={setShowModalVenta} submit={vender} />

        <Row className='content-resumen-sec-buttons'>
            <Row className="conten-buttons-agregar">
                <Col xs={4} sm={4} md={3}>
                    <Button className="button-agregar" onClick={() => setShowForm(!showForm)} variant="dark" >
                        <Icons.Plus className="icon-button" size={19} />
                        Agregar modulo
                    </Button>
                </Col>
                <Col xs={12} md={9} className="content-total-modulos-estados">
                    <Row>
                        <Col xs={2} md={2} className='content-section'>Total de Modulos: </Col>
                        <Col xs={2} md={2} className='content-total-estado' id="total"> {cantModulos.total} </Col>
                        <Col xs={2} md={2} className='content-total-estado' id="disponible"> {cantModulos.disponibles} </Col>
                        <Col xs={2} md={2} className='content-total-estado' id="ocupado"> {cantModulos.ocupados} </Col>
                        <Col xs={2} md={2} className='content-total-estado' id="vendido"> {cantModulos.vendidos} </Col>
                    </Row>
                </Col>
            </Row>
        </Row>

        <div>
            <Row>
                <Accordion>
                    {
                        modulos && modulos.length > 0 &&
                        modulos.map(modulo => (
                            <Col key={modulo.id_modulo} className="accordion-modulos">
                                <Accordion.Item eventKey={modulo.id_modulo}>
                                    <Accordion.Header className="accordion-header-modulos">
                                        <Row>
                                            {modulo.estado == 0 && <Col xs={2} md={2} id="disponible"></Col>}
                                            {modulo.estado == 1 && <Col xs={2} md={2} id="ocupado"></Col>}
                                            {modulo.estado == 2 && <Col xs={2} md={2} id="vendido"></Col>}
                                            <Col xs={4} md={4} className="accordion-nombre-modulos"> {modulo.nombre_modulo} </Col>
                                            {user.rango == "admin" && modulo.estado != 2 &&
                                                <Col xs={2} md={2} className="content-buttons" >
                                                    <Icons.CashCoin className="button-vender" onClick={() => vender(false, modulo.id_modulo)} />
                                                </Col>
                                            }
                                        </Row>
                                    </Accordion.Header>
                                    <Accordion.Body className='accordion-body-modulos'>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Costo: ${formatNumber(modulo.costo)}</p></Col>
                                                </Row>
                                            </Col>
                                            {modulo.estado == 2 &&
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Venta: ${formatNumber(modulo.venta)}</p></Col>
                                                    </Row>
                                                </Col>
                                            }
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Fecha de creación: {formatFecha(modulo.fecha_creacion)}</p></Col>
                                                </Row>
                                            </Col>
                                            {modulo.fecha_venta && (modulo.fecha_venta >= modulo.fecha_creacion && modulo.fecha_venta) &&
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Fecha de Venta: {formatFecha(modulo.fecha_venta)}</p></Col>
                                                    </Row>
                                                </Col>
                                            }
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    {modulo.estado == 0 && <Col xs={11} md={11}><p> Estado: Disponible</p></Col>}
                                                    {modulo.estado == 1 && <Col xs={11} md={11}><p> Estado: En alquiler</p></Col>}
                                                    {modulo.estado == 2 && <Col xs={11} md={11}><p> Estado: Vendido</p></Col>}
                                                </Row>
                                            </Col>
                                        </Row>
                                        {modulo.alquilers.length > 0 && <Row>
                                            <Col xs={12} md={12} >
                                                <Row className="accordion-border-top">
                                                    <Col xs={11} md={11}><p className="accordion-title-section">Trazabilidad</p></Col>
                                                </Row>
                                            </Col>
                                            <ReactApexCharts options={options} series={formatDataTimeLine(modulo.alquilers)} type="rangeBar" height={140} />
                                        </Row>
                                        }
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Col>
                        ))

                    }
                </Accordion>
            </Row>
        </div >
    </>)
}

export default React.memo(Modulos);