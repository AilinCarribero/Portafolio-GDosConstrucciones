import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

//Component
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import GraficIngresosAlquileres from './GraficIngresosAlquileres';

//Hooks
import { useUser } from '../../../hooks/useUser';
import {  formatFecha, formatNumber } from '../../../hooks/useUtils';

//Icons
import * as Icons from 'react-bootstrap-icons';

const IngresosAlquiler = () => {
    const { id } = useParams();
    const { user } = useUser();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const loadingProyectos = useSelector(state => state.proyectoRedux.loading);

    const [proyecto, setProyecto] = useState(proyectos.find(proyecto => proyecto.id_proyecto.trim() === id.trim()));

    const [infoForm, setInfoForm] = useState({});

    const [showForm, setShowForm] = useState(false);
    const [formulario, setFormulario] = useState();
    const [showIngresos, setShowIngresos] = useState(false);
    const [idShowIngresos, setIdShowIngresos] = useState();

    useEffect(() => {
        setProyecto(proyectos.find(proyecto => proyecto.id_proyecto.trim() === id.trim()));
    }, [proyectos]);

    const setShowFormSeleccion = (form, info) => {
        setInfoForm(info);
        setFormulario(form);

        setShowForm(!showForm);
    }

    const showDetallesIngresos = (id_alquiler) => {
        if(id_alquiler !== idShowIngresos) {
            setIdShowIngresos(id_alquiler);
            setShowIngresos(true)
        } else {
            setIdShowIngresos();
            setShowIngresos(false)
        }

    }

    return (<>
        {showForm && <ModalFormulario formulario={formulario} show={showForm} informacion={infoForm} setShow={setShowForm} />}

        <Row className='content-encabezado'>
            <Row className='content-title'>
                <Col xs={12} md={8} className="titulo-alquileres-vista">{id}</Col>
            </Row>
            <Row className="conten-buttons-agregar">
                {(user.rango == 'admin' || user.rango == "moderador") && <>
                    <Col xs={12} sm={12} md={3}>
                        <button className="button-agregar" onClick={() => setShowFormSeleccion('ingresoAlquiler', proyecto)} variant="dark" >
                            <Icons.Plus className="icon-button" size={19} /> Ingreso a un Alquiler
                        </button>
                    </Col>
                </>}
            </Row>
        </Row>
        <Row>
            {loadingProyectos ?
                <Row className='spinner-center-pag' >
                    <Spinner animation="border" variant="dark" />
                </Row>
                :
                proyecto && proyecto.alquilers.length > 0 && proyecto.alquilers.map(alquiler => (
                    (alquiler.modulo || alquiler.modulo_doble) &&
                    <Row key={alquiler.id_alquiler} className='separacion-seccion'>
                        <Col xs={12} sm={12}>
                            <b className='b-titulo'>
                                {alquiler.modulo ?
                                    `${alquiler.modulo.tipologia}-${alquiler.modulo.id_modulo}-${formatNumber(alquiler.modulo.ancho)}x${formatNumber(alquiler.modulo.largo)}-${alquiler.modulo.material_cerramiento}`
                                    : `OD-${alquiler.modulo_doble.id_modulo_doble}-OS-${alquiler.modulo_doble.id_modulo_uno}-OS-${alquiler.modulo_doble.id_modulo_dos}`}
                            </b>
                            <button onClick={() => showDetallesIngresos(alquiler.id_alquiler)}> <Icons.PencilSquare size={18} /> Detalle de los ingresos </button>
                        </Col>
                        {showIngresos && alquiler.id_alquiler === idShowIngresos &&
                            <Col xs={12} sm={12} className='content-detalles-ingresos'>
                                <Row>
                                    {alquiler.ingreso_alquilers.map(ingreso => (
                                        <Col xs={12} sm={12} key={ingreso.id_ingreso_alquiler}>
                                            Desde <b>{formatFecha(ingreso.fecha_desde_cobro)}</b> hasta <b>{formatFecha(ingreso.fecha_hasta_cobro)}</b> con el monto total de <b>${formatNumber(ingreso.valor_arg || ingreso.valor_usd)}</b>
                                            
                                            <button onClick={() => setShowFormSeleccion('editIngresoAlquiler', {...ingreso, modulo: alquiler.modulo, modulo_doble: alquiler.modulo_doble})} >
                                                <Icons.PencilSquare size={19} />
                                            </button>
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        }
                        {alquiler.ingreso_alquilers.length <= 0 ?
                            <Col xs={12} sm={12}>
                                No hay ingresos
                            </Col>
                            :
                            <Col xs={12} sm={12}>
                                <GraficIngresosAlquileres alquiler={alquiler} ingresoAlquiler={alquiler.ingreso_alquilers} />
                            </Col>
                        }
                    </Row>
                ))
            }
        </Row>
    </>)
}

export default React.memo(IngresosAlquiler)