import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button, Spinner, Form, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Decimal from 'decimal.js-light';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import AccordionCentroCosto from "./AccordionCentroCosto";

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';
import { useGetProyectos } from '../../../hooks/useProyectos';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';

const CentrosCostos = ({ proyectos, mostrar, setProyectos }) => {
    const { user } = useUser();

    const loading = useSelector(state => state.proyectoRedux.loading);

    const [proyectosMostrar, setProyectosMostrar] = useState([]);
    const [search, setSearch] = useState();

    const [showForm, setShowForm] = useState(false);
    const [formulario, setFormulario] = useState();

    const [totales, setTotales] = useState({
        egresos: 0,
        egresosUSD: 0,
        ingresos: 0,
        ingresosUSD: 0,
    })

    useEffect(() => {
        let auxEgresos, auxEgresosUSD, auxIngresos, auxIngresosUSD;

        if (proyectos) {
            setProyectosMostrar(
                proyectos.filter((proyecto, i) => {
                    if (i == 0) {
                        auxEgresos = new Decimal(0);
                        auxEgresosUSD = new Decimal(0);
                        auxIngresos = new Decimal(0);
                        auxIngresosUSD = new Decimal(0);
                    }

                    if (mostrar == 'proyectos' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total <= 0) {
                        return proyecto
                    } else if (mostrar == 'alquileres' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total > 0) {
                        return proyecto
                    } else if (mostrar == 'ccc-cce' && (proyecto.id_proyecto.includes('CCC') || proyecto.id_proyecto.includes('CCE'))) {
                        return proyecto
                    }
                })
            );
        }
    }, [proyectos, mostrar]);

    //Que formulario abrir
    const setShowFormSelccion = (form) => {
        setFormulario(form)
        setShowForm(!showForm);
    }

    const buscarProyecto = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setSearch(targetValue);

        if(targetValue) {
            const proyectoFilter = proyectos.filter(proyecto => {
                if (mostrar == 'proyectos' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total <= 0) {
                    if(proyecto.id_proyecto.toLowerCase().includes(targetValue.toLowerCase())) {
                        return proyecto
                    }
                } else if (mostrar == 'alquileres' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total > 0) {
                    if(proyecto.id_proyecto.toLowerCase().includes(targetValue.toLowerCase())) {
                        return proyecto
                    }
                } else if (mostrar == 'ccc-cce' && (proyecto.id_proyecto.includes('CCC') || proyecto.id_proyecto.includes('CCE'))) {
                    if(proyecto.id_proyecto.toLowerCase().includes(targetValue.toLowerCase())) {
                        return proyecto
                    }
                }
            });

            setProyectosMostrar(proyectoFilter);
        } else {
            const proyectoFilter = proyectos.filter((proyecto, i) => {
                if (mostrar == 'proyectos' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total <= 0) {
                    return proyecto
                } else if (mostrar == 'alquileres' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total > 0) {
                    return proyecto
                } else if (mostrar == 'ccc-cce' && (proyecto.id_proyecto.includes('CCC') || proyecto.id_proyecto.includes('CCE'))) {
                    return proyecto
                }
            });

            setProyectosMostrar(proyectoFilter);
        }
    }

    return (<>
        <ModalFormulario formulario={formulario} show={showForm} setShow={setShowForm} updateNew={formulario == 'proyecto' && setProyectos} />

        <Row className='content-resumen-sec-buttons'>
            <Col xs={12} md={(user.rango == "admin" || user.rango == "moderador") ? 6 : 12}>
                <Row className="conten-buttons-agregar">
                    {/* <Col xs={6} sm={6} md={4}>
                        <button className="button-agregar" onClick={() => setShowFormSelccion('egreso')} variant="dark" >
                            <Icons.Plus className="icon-button" size={19} /> Egreso
                        </button>
                    </Col>*/}
                    {(user.rango == 'admin' || user.rango == "moderador") && <>
                        <Col xs={6} sm={6} md={4}>
                            <button className="button-agregar" onClick={() => setShowFormSelccion('proyecto')} variant="dark">
                                <Icons.Plus className="icon-button" size={19} /> Proyecto
                            </button>
                        </Col>
                        <Col xs={6} sm={6} md={4}>
                            <button className="button-agregar" onClick={() => setShowFormSelccion('ingresoAlquiler')} variant="dark" >
                                <Icons.Plus className="icon-button" size={19} /> Ingreso a un Alquiler
                            </button>
                        </Col>
                        <Col xs={6} sm={6} md={4}>
                            <Form.Control className='input-text-search' onChange={buscarProyecto} name="search" type="text" value={search} placeholder='Buscar' />
                        </Col>
                    </>}
                    {/*{user.rango == 'admin' &&
                            <Col xs={6} sm={6} md={4}>
                                <button className="button-agregar" onClick={() => setShowFormSelccion('proyecto')} variant="dark">
                                    <Icons.Plus className="icon-button" size={19} /> Proyecto
                                </button>
                            </Col>
                        }
                    </>*/}
                </Row>
            </Col>
            {/*(user.rango == "admin" || user.rango == "moderador") &&
                <Col xs={12} md={6}>
                    <Row>
                        <Col xs={6} md={6} className='content-section'> Ingresos: {totales.ingresos ? formatNumber(totales.ingresos) : 0} </Col>
                        <Col xs={6} md={6} className='content-section'> Egresos: {totales.egresos ? formatNumber(totales.egresos) : 0}</Col>
                    </Row>
                </Col>
            */}
        </Row>

        {loading ?
            <Row className='spinner-center-pag' >
                <Spinner animation="border" variant="dark" />
            </Row>
            :
            <Accordion>
                {
                    proyectosMostrar &&
                    proyectosMostrar.map(proyecto => (
                        <AccordionCentroCosto key={proyecto.id_proyecto} proyecto={proyecto} setProyectos={setProyectos} />
                    ))
                }
            </Accordion>
        }
    </>)
}

export default React.memo(CentrosCostos);