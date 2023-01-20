import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button, OverlayTrigger, Tooltip, Form, Spinner } from 'react-bootstrap';
import ReactApexCharts from 'react-apexcharts';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import ModalVenta from './ModalVenta';
import UrlQr from '../../utils/modal/alerta/UrlQr';
import Alerta from '../../utils/modal/validacion/Alerta';
import ModalVinculacion from './ModalVinculacion';

//Hooks
import { formatFecha, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';
import { useUser } from '../../../hooks/useUser';
import { useResponse } from '../../../hooks/useResponse';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { setCantidadModulos } from '../../../redux/slice/Modulo/moduloSlice';

//Servise
import { deleteApiModulo, setVendido } from '../../../services/apiModulos';
import { getApiTokenQRModulos } from '../../../services/apiToken';

//Css
import '../../../style/Modulos.scss';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const Modulos = () => {
    const { response } = useResponse();
    const { user } = useUser();
    const { modulos, setModulos } = useGetModulos();

    const dispatch = useDispatch();

    const showModalUrlQr = useSelector(state => state.qrRedux.urlQr);
    const loading = useSelector(state => state.moduloRedux.loading);

    const [infoModalVenta, setInfoModalVenta] = useState({
        titulo: '',
        mensaje: ''
    });

    const [cantModulos, setCantModulos] = useState({
        total: 0,
        disponibles: 0,
        ocupados: 0,
        vendidos: 0
    });

    const [alerta, setAlerta] = useState({
        titulo: '',
        mensaje: '',
        data: ''
    });

    const [idModulo, setIdModulo] = useState();
    const [infoUpdate, setInfoUpdate] = useState([]);
    const [tokenQR, setTokenQR] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showModalVenta, setShowModalVenta] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [showAlerta, setShowAlerta] = useState(false);
    const [showFormVincular, setShowFormVincular] = useState(false);

    useEffect(() => {
        getApiTokenQRModulos().then(res => {
            setTokenQR(res.token);
        }).catch(err => {
            console.error(err);
        });
    }, [])


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

        dispatch(setCantidadModulos({
            total: modulos.length,
            disponibles: auxDisponibles,
            ocupados: auxOcupados,
            vendidos: auxVendidos
        }));

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

            const responseVendido = await setVendido(dataSend);

            const res = response(responseVendido);

            if (res) {
                setModulos(responseVendido.data);
                ToastComponent('success', 'Se registró la venta correctamente');
                setShowModalVenta(false);
            } else {
                ToastComponent('error', responseVendido.data.todoMal && responseVendido.data.todoMal);
            }
        }
    }

    const deleteModulo = (data, setDelete) => {
        setAlerta({
            titulo: 'Eliminar módulo',
            mensaje: `¿Desea eliminar el módulo ${!data.tipologia ? data.nombre_data : `${data.tipologia} - ${formatNumber(data.ancho)} x ${formatNumber(data.largo)} - ${data.material_cerramiento} - ${data.id_modulo}`}? Recuerde que si lo elimina no podrá recuperarlo`,
            data: data
        });

        setShowAlerta(true);

        if (setDelete) {
            deleteApiModulo(data.id_modulo, data).then(resModulo => {
                const res = response(resModulo);
                if (res) {
                    setModulos(resModulo.data);
                    ToastComponent('success', 'Se eliminó correctamente');
                    setShowModalVenta(false);
                } else {
                    ToastComponent('error', resModulo.data.todoMal && resModulo.data.todoMal);
                }
            }).catch(err => {
                console.error(err);

                ToastComponent('error', err.data.todoMal && err.data.todoMal);
            })
        }
    }

    const updateModalModulo = (modulo) => {
        setInfoUpdate(modulo);
        setShowForm(true);
    }

    const setShowFormReset = (show) => {
        setShowForm(show);
        setInfoUpdate([]);
    }

    const searchTipologia = (siglas) => {
        switch (siglas) {
            case "OS": return 'Oficina Simple'
            case "OD": return 'Oficina Doble'
            case "MA": return 'Módulo Apareado'
            case "E": return 'Especial'
            case "BM": return 'Base Maritima'
        }
    }

    const handleChangeToken = (e) => {
        const targetCheck = e.target.checked;

        setShowToken(targetCheck)
    }

    const handleCopy = (e, copy) => {
        e.preventDefault();
        navigator.clipboard.writeText(copy);
        ToastComponent('success', "Se copió correctamente");
    }

    const renderTextDimensiones = (alto, ancho) => {
        let text = '';

        alto.map((alto, i) => {
            if (i === 0) {
                text = `${formatNumber(alto)} x ${formatNumber(ancho[i])}`;
            } else {
                text = text + ` / ${formatNumber(alto)} x ${formatNumber(ancho[i])}`;
            }
        });

        return text;
    }

    return (<>
        <ModalFormulario formulario={'modulo'} informacion={infoUpdate} show={showForm} setShow={setShowFormReset} updateNew={setModulos} />
        <ModalVenta titulo={infoModalVenta.titulo} show={showModalVenta} setShow={setShowModalVenta} submit={vender} />
        <UrlQr show={showModalUrlQr} />
        <Alerta titulo={alerta.titulo} mensaje={alerta.mensaje} show={showAlerta} setShow={setShowAlerta} submit={deleteModulo} data={alerta.data} />
        <ModalVinculacion show={showFormVincular} setShow={setShowFormVincular} modulos={modulos} setModulos={setModulos} />

        <Row className='content-resumen-sec-buttons'>
            <Row className="conten-buttons-agregar">
                <Col xs={12} sm={3} md={2}>
                    <Button className="button-agregar" onClick={() => setShowForm(!showForm)} variant="dark" >
                        <Icons.Plus className="icon-button" size={19} />
                        Agregar módulo
                    </Button>
                </Col>
                <Col xs={12} sm={3} md={2}>
                    <Button className="button-agregar" onClick={() => setShowFormVincular(!showFormVincular)} variant="dark" >
                        <Icons.Plus className="icon-button" size={19} />
                        Vincular módulos
                    </Button>
                </Col>
                <Col xs={12} md={5} className="content-total-modulos-estados">
                    <Row>
                        <Col xs={12} md={4} className='content-section'>Total de Módulos: </Col>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Módulos en total.</Tooltip>} >
                            <Col xs={3} md={2} className='content-total-estado' id="total"> {loading ? <Spinner animation="border" variant="light" size='sm' /> : cantModulos.total} </Col>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Módulos disponibles.</Tooltip>} >
                            <Col xs={3} md={2} className='content-total-estado' id="disponible"> {loading ? <Spinner animation="border" variant="light" size='sm' /> : cantModulos.disponibles} </Col>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Módulos ocupados.</Tooltip>} >
                            <Col xs={3} md={2} className='content-total-estado' id="ocupado"> {loading ? <Spinner animation="border" variant="light" size='sm' /> : cantModulos.ocupados} </Col>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip>Módulos vendidos.</Tooltip>} >
                            <Col xs={3} md={2} className='content-total-estado' id="vendido"> {loading ? <Spinner animation="border" variant="light" size='sm' /> : cantModulos.vendidos} </Col>
                        </OverlayTrigger>
                    </Row>
                </Col>
                {user.rango == "admin" &&
                    <Col xs={12} sm={3} className="content-token">
                        <Row>
                            <Col xs={7} sm={7}>
                                {showToken && <button onClick={(e) => handleCopy(e, tokenQR)}><h6>{tokenQR} <Icons.Files size="20px" className='icon-text-copy' /></h6></button>}
                            </Col>
                            <Col xs={5} sm={5}>
                                <Form.Check type="switch" label="Ver token" onChange={handleChangeToken} name="show_token" checked={showToken} />
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>
        </Row>

        <div>
            {loading ?
                <Row className='spinner-center-pag' >
                    <Spinner animation="border" variant="dark" />
                </Row>
                :
                <Row>
                    <Accordion>
                        {
                            modulos && modulos.length > 0 &&
                            modulos.map(modulo => (
                                <Col key={modulo.id_modulo} className="accordion-modulos">
                                    <Accordion.Item eventKey={modulo.id_modulo}>
                                        <Accordion.Header className="accordion-header-modulos">
                                            <Row>
                                                {modulo.estado == 0 &&
                                                    <OverlayTrigger placement="right" overlay={<Tooltip>Disponible {modulo.vinculado && 'vinculado'}.</Tooltip>} >
                                                        <Col xs={1} md={1} id="disponible">
                                                            {modulo.vinculado && <Icons.Diagram2Fill className='icon-vinculado' />}
                                                        </Col>
                                                    </OverlayTrigger>
                                                }
                                                {modulo.estado == 1 &&
                                                    <OverlayTrigger placement="right" overlay={<Tooltip>Ocupado {modulo.vinculado && 'vinculado'}.</Tooltip>} >
                                                        <Col xs={1} md={1} id="ocupado">
                                                            {modulo.vinculado && <Icons.Diagram2Fill className='icon-vinculado' />}
                                                        </Col>
                                                    </OverlayTrigger>
                                                }
                                                {modulo.estado == 2 &&
                                                    <OverlayTrigger placement="right" overlay={<Tooltip>Vendido {modulo.vinculado && 'vinculado'}.</Tooltip>} >
                                                        <Col xs={1} md={1} id="vendido">
                                                            {modulo.vinculado && <Icons.Diagram2Fill className='icon-vinculado' />}
                                                        </Col>
                                                    </OverlayTrigger>
                                                }
                                                <Col xs={9} md={10} className="accordion-nombre-modulos">
                                                    {!modulo.tipologia ?
                                                        modulo.nombre_modulo
                                                        : `${modulo.tipologia} - ${modulo.id_modulo} - ${formatNumber(modulo.ancho)} x ${formatNumber(modulo.largo)} - ${modulo.material_cerramiento} `
                                                    }
                                                </Col>
                                                {user.rango == "admin" && modulo.estado != 2 &&
                                                    <Col className="content-buttons" >
                                                        <Row>
                                                            <Col xs={6} sm={6}>
                                                                <Icons.CashCoin className="button-vender" onClick={() => vender(false, modulo.id_modulo)} />
                                                            </Col>
                                                            <Col xs={6} sm={6}>
                                                                <Icons.TrashFill className="button-delete" onClick={() => deleteModulo(modulo)} />
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                }
                                            </Row>
                                        </Accordion.Header>
                                        <Accordion.Body className='accordion-body-modulos'>
                                            <Row>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Costo: {modulo.costo ? `$${formatNumber(modulo.costo)}` : ''}  {modulo.costo_usd ? `USD$${formatNumber(modulo.costo_usd)}` : ''}</p></Col>
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
                                                        <Col xs={11} md={11}><p> Dimensión: {`Ancho: ${formatNumber(modulo.ancho)} / Largo: ${formatNumber(modulo.largo)}`}</p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Tipologia: {searchTipologia(modulo.tipologia)}</p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Material de Cerramiento: {modulo.material_cerramiento === "PUR" ? 'PUR (Poliuretano)' : (modulo.material_cerramiento === 'EPS' ? 'EPS (Poliestireno)' : modulo.material_cerramiento)}</p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Colores: {`Exterior: ${modulo.col_exterior} - Interior: ${modulo.col_interior}`}</p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Material del Piso: {modulo.material_piso}</p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Equipamiento: {modulo.equipamiento}</p></Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}>
                                                            <p>Carpinteria: Puertas: {modulo.puertas}</p>
                                                            <p>Ventanas: {modulo.ventanas} {modulo.vent_alto && (Array.isArray(modulo.vent_alto.split('-')) ? 'con dimensiones: ' + renderTextDimensiones(modulo.vent_alto.split('-'), modulo.vent_ancho.split('-')) : `con dimensión ${formatNumber(modulo.vent_alto)} x ${formatNumber(modulo.vent_ancho)}`)}</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Instalación Eléctrica: {modulo.inst_electrica ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Instalación Sanitaria: {modulo.inst_sanitaria ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={1} md={1}></Col>
                                                        <Col xs={11} md={11}><p> Instalaciones Especiales: {modulo.inst_especiales ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                                    </Row>
                                                </Col>
                                                {modulo.descripcion &&
                                                    <Col xs={12} md={12} className="col-12-accordion">
                                                        <Row>
                                                            <Col xs={12} md={12}><p>Descripción: {modulo.descripcion}</p></Col>
                                                        </Row>
                                                    </Col>
                                                }
                                                {modulo.url_qr &&
                                                    <Col xs={12} md={12} className="col-12-accordion">
                                                        <Row>
                                                            <Col className='url-qr' xs={12} md={12}>
                                                                <p>URL del QR:
                                                                    <button type='button' className='button-copy-modulo' onClick={(e) => handleCopy(e, modulo.url_qr)}>
                                                                        {modulo.url_qr} <Icons.Files size="25px" className='icon-text-copy' />
                                                                    </button>
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                }
                                                {modulo.ubicacion &&
                                                    <Col xs={12} md={12} className="col-12-accordion">
                                                        <Row>
                                                            <Col className='url-qr' xs={12} md={12}>
                                                                <p> Ubicación:
                                                                    <button type='button' className='button-copy-modulo' onClick={(e) => handleCopy(e, modulo.ubicacion)}>
                                                                        {modulo.ubicacion} <Icons.Files size="25px" className='icon-text-copy' />
                                                                    </button>
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                }
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
                                            {user.rango == 'admin' &&
                                                <Row className="border-top">
                                                    <Col xs={12} md={12}>
                                                        <p className="accordion-title-section">Acciones</p>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <button className="button-action" onClick={() => updateModalModulo(modulo)}>
                                                            <Row>
                                                                <Col xs={1} md={1} className='icon-action'>
                                                                    <Icons.PencilSquare size={19} />
                                                                </Col>
                                                                <Col xs={10} md={10} className='text-action'>
                                                                    Modificar
                                                                </Col>
                                                            </Row>
                                                        </button>
                                                    </Col>
                                                </Row>
                                            }
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Col>
                            ))

                        }
                    </Accordion>
                </Row>
            }
        </div >
    </>)
}

export default React.memo(Modulos);