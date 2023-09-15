import React from 'react';
import { Accordion, Col, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';

//Componentes
import GraficTrazabilidadModulo from './GraficTrazabilidadModulo';

//Redux
import { useSelector } from 'react-redux';

//Hooks
import { useGetModulos } from '../../../hooks/useModulos';
import { formatFecha, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const ModulosDobles = () => {
    const { modulosDobles } = useGetModulos();
    const { user } = useUser();

    const loading = useSelector(state => state.moduloRedux.loading);

    const handleCopy = (e, copy) => {
        e.preventDefault();
        
        navigator.clipboard.writeText(copy);
        ToastComponent('success', "Se copió correctamente");
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

    return (
        loading ?
            <Row className='spinner-center-pag' >
                <Spinner animation="border" variant="dark" />
            </Row>
            :
            <Accordion>
                {
                    modulosDobles && modulosDobles.length > 0 &&
                    modulosDobles.map(moduloDoble => (
                        <Col key={moduloDoble.id_modulo_doble} className="accordion-modulos">
                            <Accordion.Item eventKey={moduloDoble.id_modulo_doble}>
                                <Accordion.Header className="accordion-header-modulos">
                                    <Row>
                                        {moduloDoble.estado == 0 &&
                                            <OverlayTrigger placement="right" overlay={<Tooltip>Disponible {moduloDoble.vinculacion && 'vinculado'}.</Tooltip>} >
                                                <Col xs={1} md={1} id="disponible">
                                                    {moduloDoble.vinculacion && <Icons.Diagram2Fill className='icon-vinculado' />}
                                                </Col>
                                            </OverlayTrigger>
                                        }
                                        {moduloDoble.estado == 1 &&
                                            <OverlayTrigger placement="right" overlay={<Tooltip>Ocupado {moduloDoble.vinculacion && 'vinculado'}.</Tooltip>} >
                                                <Col xs={1} md={1} id="ocupado">
                                                    {moduloDoble.vinculacion && <Icons.Diagram2Fill className='icon-vinculado' />}
                                                </Col>
                                            </OverlayTrigger>
                                        }
                                        {moduloDoble.estado == 2 &&
                                            <OverlayTrigger placement="right" overlay={<Tooltip>Vendido {moduloDoble.vinculacion && 'vinculado'}.</Tooltip>} >
                                                <Col xs={1} md={1} id="vendido">
                                                    {moduloDoble.vinculacion && <Icons.Diagram2Fill className='icon-vinculado' />}
                                                </Col>
                                            </OverlayTrigger>
                                        }
                                        {moduloDoble.estado == 3 &&
                                            <OverlayTrigger placement="right" overlay={<Tooltip>En Espera {moduloDoble.vinculacion && 'vinculado'}.</Tooltip>} >
                                                <Col xs={1} md={1} id="en-espera">
                                                    {moduloDoble.vinculacion && <Icons.Diagram2Fill className='icon-vinculado' />}
                                                </Col>
                                            </OverlayTrigger>
                                        }
                                        <Col xs={9} md={10} className="accordion-nombre-modulos">
                                            {`OD - ${moduloDoble.id_modulo_doble} - OS - ${moduloDoble.id_modulo_uno} - OS - ${moduloDoble.id_modulo_dos} `}
                                        </Col>
                                    </Row>
                                </Accordion.Header>
                                <Accordion.Body className='accordion-body-modulos'>
                                    <Row>
                                        <Col xs={12} md={12}>
                                            <Row>
                                                <Col xs={12} md={12}><p><b> OS - {moduloDoble.id_modulo_uno}</b></p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Costo: ${formatNumber(moduloDoble.costo)}</p></Col>
                                            </Row>
                                        </Col>
                                        {moduloDoble.moduloUno.estado == 2 &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Venta: ${formatNumber(moduloDoble.moduloUno.venta)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Fecha de creación: {formatFecha(moduloDoble.moduloUno.fecha_creacion)}</p></Col>
                                            </Row>
                                        </Col>
                                        {moduloDoble.moduloUno.fecha_venta && (moduloDoble.moduloUno.fecha_venta >= moduloDoble.moduloUno.fecha_creacion && moduloDoble.moduloUno.fecha_venta) &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Fecha de Venta: {formatFecha(moduloDoble.moduloUno.fecha_venta)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Dimensión: {`Ancho: ${formatNumber(moduloDoble.moduloUno.ancho)} / Largo: ${formatNumber(moduloDoble.moduloUno.largo)}`}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Tipologia: {searchTipologia(moduloDoble.moduloUno.tipologia)}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Material de Cerramiento: {moduloDoble.moduloUno.material_cerramiento === "PUR" ? 'PUR (Poliuretano)' : (moduloDoble.moduloUno.material_cerramiento === 'EPS' ? 'EPS (Poliestireno)' : moduloDoble.moduloUno.material_cerramiento)}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Colores: {`Exterior: ${moduloDoble.moduloUno.col_exterior} - Interior: ${moduloDoble.moduloUno.col_interior}`}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Material del Piso: {moduloDoble.moduloUno.material_piso}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Equipamiento: {moduloDoble.moduloUno.equipamiento}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}>
                                                    <p>Carpinteria: Puertas: {moduloDoble.moduloUno.puertas}</p>
                                                    <p>Ventanas: {moduloDoble.moduloUno.ventanas} {moduloDoble.moduloUno.vent_alto && (Array.isArray(moduloDoble.moduloUno.vent_alto.split('-')) ? 'con dimensiones: ' + renderTextDimensiones(moduloDoble.moduloUno.vent_alto.split('-'), moduloDoble.moduloUno.vent_ancho.split('-')) : `con dimensión ${formatNumber(moduloDoble.moduloUno.vent_alto)} x ${formatNumber(moduloDoble.moduloUno.vent_ancho)}`)}</p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Instalación Eléctrica: {moduloDoble.moduloUno.inst_electrica ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Instalación Sanitaria: {moduloDoble.moduloUno.inst_sanitaria ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Instalaciones Especiales: {moduloDoble.moduloUno.inst_especiales ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                            </Row>
                                        </Col>
                                        {moduloDoble.moduloUno.descripcion &&
                                            <Col xs={12} md={12} className="col-12-accordion">
                                                <Row>
                                                    <Col xs={12} md={12}><p>Descripción: {moduloDoble.moduloUno.descripcion}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        {moduloDoble.moduloUno.url_qr &&
                                            <Col xs={12} md={12} className="col-12-accordion">
                                                <Row>
                                                    <Col className='url-qr' xs={12} md={12}>
                                                        <p>URL del QR:
                                                            <button type='button' className='button-copy-modulo' onClick={(e) => handleCopy(e, moduloDoble.moduloUno.url_qr)}>
                                                                {moduloDoble.moduloUno.url_qr} <Icons.Files size="25px" className='icon-text-copy' />
                                                            </button>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        }
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={12}>
                                            <Row>
                                                <Col xs={12} md={12}><p><b> OS - {moduloDoble.id_modulo_dos}</b></p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Costo: ${formatNumber(moduloDoble.moduloDos.costo)}</p></Col>
                                            </Row>
                                        </Col>
                                        {moduloDoble.moduloDos.estado == 2 &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Venta: ${formatNumber(moduloDoble.moduloDos.venta)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Fecha de creación: {formatFecha(moduloDoble.moduloDos.fecha_creacion)}</p></Col>
                                            </Row>
                                        </Col>
                                        {moduloDoble.moduloDos.fecha_venta && (moduloDoble.moduloDos.fecha_venta >= moduloDoble.moduloDos.fecha_creacion && moduloDoble.moduloDos.fecha_venta) &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Fecha de Venta: {formatFecha(moduloDoble.moduloDos.fecha_venta)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Dimensión: {`Ancho: ${formatNumber(moduloDoble.moduloDos.ancho)} / Largo: ${formatNumber(moduloDoble.moduloDos.largo)}`}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Tipologia: {searchTipologia(moduloDoble.moduloDos.tipologia)}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Material de Cerramiento: {moduloDoble.moduloDos.material_cerramiento === "PUR" ? 'PUR (Poliuretano)' : (moduloDoble.moduloDos.material_cerramiento === 'EPS' ? 'EPS (Poliestireno)' : moduloDoble.moduloDos.material_cerramiento)}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Colores: {`Exterior: ${moduloDoble.moduloDos.col_exterior} - Interior: ${moduloDoble.moduloDos.col_interior}`}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Material del Piso: {moduloDoble.moduloDos.material_piso}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Equipamiento: {moduloDoble.moduloDos.equipamiento}</p></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}>
                                                    <p>Carpinteria: Puertas: {moduloDoble.moduloDos.puertas}</p>
                                                    <p>Ventanas: {moduloDoble.moduloDos.ventanas} {moduloDoble.moduloDos.vent_alto && (Array.isArray(moduloDoble.moduloDos.vent_alto.split('-')) ? 'con dimensiones: ' + renderTextDimensiones(moduloDoble.moduloDos.vent_alto.split('-'), moduloDoble.moduloDos.vent_ancho.split('-')) : `con dimensión ${formatNumber(moduloDoble.moduloDos.vent_alto)} x ${formatNumber(moduloDoble.moduloDos.vent_ancho)}`)}</p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Instalación Eléctrica: {moduloDoble.moduloDos.inst_electrica ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Instalación Sanitaria: {moduloDoble.moduloDos.inst_sanitaria ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Instalaciones Especiales: {moduloDoble.moduloDos.inst_especiales ? <Icons.CheckSquareFill color='#05be40' /> : <Icons.XSquareFill color='#ce0000' />}</p></Col>
                                            </Row>
                                        </Col>
                                        {moduloDoble.moduloDos.descripcion &&
                                            <Col xs={12} md={12} className="col-12-accordion">
                                                <Row>
                                                    <Col xs={12} md={12}><p>Descripción: {moduloDoble.moduloDos.descripcion}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        {moduloDoble.moduloDos.url_qr &&
                                            <Col xs={12} md={12} className="col-12-accordion">
                                                <Row>
                                                    <Col className='url-qr' xs={12} md={12}>
                                                        <p>URL del QR:
                                                            <button type='button' className='button-copy-modulo' onClick={(e) => handleCopy(e, moduloDoble.moduloDos.url_qr)}>
                                                                {moduloDoble.moduloDos.url_qr} <Icons.Files size="25px" className='icon-text-copy' />
                                                            </button>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        }
                                    </Row>
                                    {(user.rango == 'admin' || user.rango == 'moderador') && moduloDoble.alquilers.length > 0 &&
                                        <Row>
                                            <Col xs={12} md={12} >
                                                <Row className="accordion-border-top">
                                                    <Col xs={11} md={11}><p className="accordion-title-section">Trazabilidad</p></Col>
                                                </Row>
                                            </Col>
                                            <GraficTrazabilidadModulo alquileres={moduloDoble.alquilers} />
                                        </Row>
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                        </Col>
                    ))

                }
            </Accordion>

    )
}

export default ModulosDobles