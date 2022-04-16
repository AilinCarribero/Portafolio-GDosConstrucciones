import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

//Hooks
import { formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';
import { useGetProyectos } from '../../../hooks/useProyectos';

const CentrosCostos = ({ proyectos, mostrar,setProyectos }) => {
    const { user } = useUser();

    const [proyectosMostrar, setProyectosMostrar] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formulario, setFormulario] = useState();

    useEffect(() => {
        if (proyectos) {
            setProyectosMostrar(
                proyectos.filter(proyecto => {
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

    //Egresos totales de un proyecto determinado
    const egresosProyecto = (PEgresos) => {
        let auxEgresosProyecto = 0;

        if (PEgresos) {
            PEgresos.map(egreso => {
                auxEgresosProyecto += parseFloat(egreso.valor_pago);
            })
        }
        return (auxEgresosProyecto)
    }

    //Egresos totales de un proyecto determinado en dolares
    const egresosUSDProyecto = (PUSDEgresos) => {
        let auxEgresosProyecto = 0;

        if (PUSDEgresos) {
            PUSDEgresos.map(egreso => {
                auxEgresosProyecto += parseFloat(egreso.valor_usd);
            })
        }
        return (auxEgresosProyecto)
    }

    //Ingresos totales de un proyecto determinado
    const ingresosProyecto = (PIngresos) => {
        let auxIngresosProyecto = 0;

        if (PIngresos) {
            PIngresos.map(ingreso => {
                auxIngresosProyecto += parseFloat(ingreso.valor_cobro);
            })
        }
        return (auxIngresosProyecto)
    }

    //Ingresos totales de un proyecto determinado en dolares
    const ingresosUSDProyecto = (PUSDIngresos) => {
        let auxIngresosProyecto = 0;

        if (PUSDIngresos) {
            PUSDIngresos.map(ingreso => {
                auxIngresosProyecto += parseFloat(ingreso.valor_usd);
            })
        }
        return (auxIngresosProyecto)
    }

    return (<>
        <Row className="conten-buttons-agregar">
            <Col xs={6} sm={6} md={4}>
                <Button className="button-agregar" onClick={() => setShowFormSelccion('egreso')} variant="dark" >
                    <Icons.Plus className="icon-button" size={19} />
                    Agregar Egreso
                </Button>
            </Col>
            {user.rango != "usuario comun" && <>
                <Col xs={6} sm={6} md={4}>
                    <Button className="button-agregar" onClick={() => setShowFormSelccion('ingreso')} variant="dark" >
                        <Icons.Plus className="icon-button" size={19} />
                        Agregar Ingreso
                    </Button>
                </Col>
                {user.rango == 'admin' &&
                    <Col xs={6} sm={6} md={4}>
                        <Button className="button-agregar" onClick={() => setShowFormSelccion('proyecto')} variant="dark">
                            <Icons.Plus className="icon-button" size={19} />
                            Agregar proyecto
                        </Button>
                    </Col>
                }
            </>}
        </Row>
        <ModalFormulario formulario={formulario} show={showForm} setShow={setShowForm} updateNew={formulario == 'proyecto' && setProyectos} />

        <Accordion>
            {
                proyectosMostrar &&
                proyectosMostrar.map(proyecto => (
                    <Col key={proyecto.id_proyecto} >
                        <Accordion.Item eventKey={proyecto.id_proyecto} className={proyecto.id_centro_costo == 1 || proyecto.id_centro_costo == 3 ? 'accordionCC' : ''}>
                            <Accordion.Header> {proyecto.id_proyecto} </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    {proyecto.id_centro_costo == 2 && user.rango != 'usuario comun' && <>
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}></Col>
                                                <Col xs={11} md={11}><p> Venta: ${formatNumber(proyecto.venta)}</p></Col>
                                            </Row>
                                        </Col>
                                        {proyecto.costo > 0 &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}></Col>
                                                    <Col xs={11} md={11}><p> Costo: ${formatNumber(proyecto.costo)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                        {proyecto.alquiler_total > 0 &&
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={1} md={1}>
                                                        <Link to={`/alquileres/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                                    </Col>
                                                    <Col xs={11} md={11}><p> Total por Alquileres: ${formatNumber(proyecto.alquiler_total)}</p></Col>
                                                </Row>
                                            </Col>
                                        }
                                    </>}
                                </Row>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <Row>
                                            <Col xs={1} md={1}>
                                                <Link to={`/egresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                            </Col>
                                            <Col xs={11} md={11}><p> Egresos:</p>
                                                <Col xs={6} md={6}><p>${formatNumber(egresosProyecto(proyecto.egresos))} </p></Col>
                                                <Col xs={5} md={5}><p>USD${formatNumber(egresosUSDProyecto(proyecto.egresos))} </p></Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {user.rango != "usuario comun" &&
                                        <Col xs={12} md={6}>
                                            <Row>
                                                <Col xs={1} md={1}>
                                                    <Link to={`/ingresos/${proyecto.id_proyecto}`}> <Icons.ArchiveFill className="icon-detalle" /> </Link>
                                                </Col>
                                                <Col xs={11} md={11}><p> Ingresos:</p>
                                                    <Col xs={6} md={6}><p>${formatNumber(ingresosProyecto(proyecto.ingresos))} </p></Col>
                                                    <Col xs={5} md={5}><p>USD${formatNumber(ingresosUSDProyecto(proyecto.ingresos))} </p></Col>
                                                </Col>
                                            </Row>
                                        </Col>
                                    }
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Col>
                ))
            }
        </Accordion>
    </>)
}

export default React.memo(CentrosCostos);