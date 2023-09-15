import React, { useState } from 'react';
import { Accordion, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import FormContrato from '../alquiler/FormContrato';
import Alerta from '../../utils/modal/validacion/Alerta';

//Hooks
import { ToastComponent, calcDifDias, formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';
import { useGetAlquileresId } from '../../../hooks/useAlquileres';
import { useResponse } from '../../../hooks/useResponse';

//Redux
import { useDispatch } from 'react-redux';
import { getProyectos } from '../../../redux/slice/Proyecto/thunks';

//Servise
import { getApiDeleteProyectos } from '../../../services/apiProyectos';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

const AccordionCentrosCostos = ({ proyecto, setProyectos }) => {
    const dispatch = useDispatch();
    const { user } = useUser();
    const { setAlquileres } = useGetAlquileresId();
    const { response } = useResponse();

    const [alerta, setAlerta] = useState({
        titulo: '',
        mensaje: '',
        data: ''
    });

    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [showModalFormContrato, setShowModalFormContrato] = useState(false);
    const [showAlerta, setShowAlerta] = useState(false);

    const [actionContrato, setActionContrato] = useState();
    const [idProyecto, setIdProyecto] = useState();

    const updateProyecto = () => {
        setShowFormUpdate(true);
    }

    const modalFormContrato = (action, id) => {
        setShowModalFormContrato(true);
        setIdProyecto(id)
        setActionContrato(action);
    }

    const deleteProyecto = (id_proyecto, setDelete) => {
        setAlerta({
            titulo: 'Eliminar proyecto',
            mensaje: `¿Desea eliminar el proyecto ${id_proyecto}? Recuerde que si lo elimina no podrá recuperarlo`,
            data: id_proyecto
        });

        setShowAlerta(true);

        if (setDelete) {
            getApiDeleteProyectos(id_proyecto).then(resProyecto => {
                const res = response(resProyecto);
                if (res) {
                    dispatch(getProyectos());
                    ToastComponent('success', 'Se eliminó correctamente');
                    setShowAlerta(false);
                } else {
                    ToastComponent('error', resProyecto.data.todoMal && resProyecto.data.todoMal);
                }
            }).catch(err => {
                console.error(err);

                ToastComponent('error', err.data.todoMal && err.data.todoMal);
            })
        }
    }

    return (<>
        {showFormUpdate && <ModalFormulario formulario={'proyecto'} informacion={proyecto} show={showFormUpdate} setShow={setShowFormUpdate} updateNew={setProyectos} />}
        {showModalFormContrato && <FormContrato idProyecto={idProyecto} show={showModalFormContrato} setShow={setShowModalFormContrato} setAlquileres={setAlquileres} actionContrato={actionContrato} />}
        {showAlerta && <Alerta titulo={alerta.titulo} mensaje={alerta.mensaje} show={showAlerta} setShow={setShowAlerta} submit={deleteProyecto} data={alerta.data} />}

        <Accordion.Item eventKey={proyecto.id_proyecto} className={proyecto.id_centro_costo == 1 || proyecto.id_centro_costo == 3 ? 'accordionCC' : 'content-accordion'}>
            <Accordion.Header>
                {/*Estados: 1.Por Empezar 2.En proceso 3.Finalizado */}
                {proyecto.id_estado == 1 &&
                    <OverlayTrigger placement="right" overlay={<Tooltip>Pendiente.</Tooltip>} >
                        <Col xs={1} md={1} className="state-pendiente" > <Icons.ConeStriped size={19} className='state-icon' /></Col>
                    </OverlayTrigger>
                }
                {proyecto.id_estado == 2 &&
                    <OverlayTrigger placement="right" overlay={<Tooltip>En proceso.</Tooltip>} >
                        <Col xs={1} md={1} className="state-proceso" > <Icons.Tools size={17} className='state-icon' /> </Col>
                    </OverlayTrigger>
                }
                {proyecto.id_estado == 3 &&
                    <OverlayTrigger placement="right" overlay={<Tooltip>Finalizado.</Tooltip>} >
                        <Col xs={1} md={1} className="state-finish" > <Icons.HouseDoorFill size={19} className='state-icon' /> </Col>
                    </OverlayTrigger>
                }

                <Col xs={proyecto.alquilers.length > 0 && proyecto.id_estado != 3 ? 5 : 9} md={proyecto.alquilers.length > 0 && proyecto.id_estado != 3 ? 6 : 9}>{proyecto.id_proyecto}</Col>
                {proyecto.fecha_f_proyecto && calcDifDias(new Date(), proyecto.fecha_f_proyecto) > 0 && <>
                    <Col xs={2} md={2} className={calcDifDias(new Date(), proyecto.fecha_f_proyecto) <= 15 ? "text-for-finish" : ""} >
                        Dias restantes: {calcDifDias(new Date(), proyecto.fecha_f_proyecto)}
                    </Col>
                    {proyecto.diasRestAlquileres && proyecto.diasRestAlquileres != calcDifDias(new Date(), proyecto.fecha_f_proyecto) &&
                        <Col xs={2} md={2} className={proyecto.diasRestAlquileres <= 15 ? "text-for-finish" : ""} >
                            Próximo vencimiento: {proyecto.diasRestAlquileres}
                        </Col>
                    }
                </>}
            </Accordion.Header>
            <Accordion.Body>
                <Row>
                    {proyecto.id_centro_costo == 2 && (user.rango == "admin") && <>
                        {proyecto.venta > 0 &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}></Col>
                                    <Col xs={11} md={11}><p> Venta: ${formatNumber(proyecto.venta)}</p></Col>
                                </Row>
                            </Col>}
                        {proyecto.costo > 0 &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}></Col>
                                    <Col xs={11} md={11}><p> Costo: ${formatNumber(proyecto.costo)}</p></Col>
                                </Row>
                            </Col>
                        }
                    </>}
                    {proyecto.alquiler_total > 0 && (user.rango === "admin") &&
                        <Col xs={12} md={6}>
                            <Row>
                                <Col xs={1} md={1}>
                                    {proyecto.alquilers.length > 0 && <Link to={`/alquileres/${proyecto.id_proyecto}`}> <Icons.BoxArrowInRight className="icon-detalle" /> </Link>}
                                </Col>
                                <Col xs={11} md={11}><p> Total por Alquileres: ${formatNumber(proyecto.alquiler_total)}</p></Col>
                            </Row>
                        </Col>
                    }
                    {proyecto.alquiler_total > 0 && (user.rango === "moderador") &&
                        <Col xs={12} md={6}>
                            <Row>
                                <Col xs={1} md={1}>
                                    {proyecto.alquilers.length > 0 && <Link to={`/alquileres/${proyecto.id_proyecto}`}> <Icons.BoxArrowInRight className="icon-detalle" /> </Link>}
                                </Col>
                                <Col xs={11} md={11}><p>Alquileres</p></Col>
                            </Row>
                        </Col>
                    }
                    {proyecto.alquiler_total > 0 && (user.rango === "admin" || user.rango === "moderador") &&
                        <Col xs={12} md={6}>
                            <Row>
                                <Col xs={1} md={1}>
                                    {proyecto.alquilers.length > 0 && <Link to={`/alquileres/ingresos/${proyecto.id_proyecto}`}> <Icons.BoxArrowInRight className="icon-detalle" /> </Link>}
                                </Col>
                                <Col xs={11} md={11}><p>Ingresos por Alquiler</p></Col>
                            </Row>
                        </Col>
                    }
                </Row>
                <Row>
                    {(user.rango == "admin" || user.rango == "moderador") && proyecto.fecha_i_proyecto && <>
                        <Col xs={12} md={6}>
                            <Row>
                                <Col xs={1} md={1}></Col>
                                <Col xs={11} md={11}><p> Fecha de inicio: {formatFecha(proyecto.fecha_i_proyecto)}</p> </Col>
                            </Row>
                        </Col>
                        {proyecto.fecha_f_proyecto && (new Date(proyecto.fecha_f_proyecto).toISOString().slice(0, 10) != new Date('2200-01-01').toISOString().slice(0, 10)) &&
                            <Col xs={12} md={6}>
                                <Row>
                                    <Col xs={1} md={1}></Col>
                                    <Col xs={11} md={11}><p> Fecha de finalizacion: {formatFecha(proyecto.fecha_f_proyecto)}</p> </Col>
                                </Row>
                            </Col>
                        }
                    </>}
                </Row>
                {(user.rango == 'admin' || user.rango == "moderador") &&
                    <Row className="border-top">
                        <Col xs={12} md={12}>
                            <p className="accordion-title-section">Acciones</p>
                        </Col>
                        <Col xs={12} md={3}>
                            <button className="button-action" onClick={() => updateProyecto()}>
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
                        <Col xs={12} md={3}>
                            <button className="button-action" onClick={() => modalFormContrato('Nuevo', proyecto.id_proyecto)}>
                                <Row>
                                    <Col xs={1} md={1} className='icon-action'>
                                        <Icons.PencilSquare size={19} />
                                    </Col>
                                    <Col xs={10} md={10} className='text-action'>
                                        Agregar alquiler
                                    </Col>
                                </Row>
                            </button>
                        </Col>
                        {user.rango === 'admin' && <Col xs={12} md={3}>
                            <button className="button-action" onClick={() => deleteProyecto(proyecto.id_proyecto)}>
                                <Row>
                                    <Col xs={1} md={1} className='icon-action'>
                                        <Icons.TrashFill size={19} />
                                    </Col>
                                    <Col xs={10} md={10} className='text-action'>
                                        Eliminar
                                    </Col>
                                </Row>
                            </button>
                        </Col>}
                    </Row>
                }
            </Accordion.Body>
        </Accordion.Item>
    </>)
}

export default React.memo(AccordionCentrosCostos);