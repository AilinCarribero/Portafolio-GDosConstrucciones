import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Col, Row, Spinner, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

//Component
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';

//Hooks
import { useUser } from '../../../hooks/useUser';

//Icons
import * as Icons from 'react-bootstrap-icons';

const IngresosAlquiler = () => {
    const { id } = useParams();
    const { user } = useUser();

    const yearHere = new Date().getFullYear();
    const monthHere = new Date().getMonth();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const loadingProyectos = useSelector(state => state.proyectoRedux.loading);

    const [proyecto, setProyecto] = useState(proyectos.find(proyecto => proyecto.id_proyecto.trim() === id.trim()));

    const [showForm, setShowForm] = useState(false);
    const [formulario, setFormulario] = useState();

    useEffect(() => {
        setProyecto(proyectos.find(proyecto => proyecto.id_proyecto.trim() === id.trim()));
    }, [proyectos]);

    const ingresoAlquilerXMes = (ingresos) => {
        if (ingresos.length > 0) {
            let mes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            ingresos.map(ingreso => {
                const inicioPago = ingreso.fecha_desde_cobro;
                const finPago = ingreso.fecha_hasta_cobro;

                const fecha = moment(inicioPago).add(1, 'days');

                const fechaDesde = moment(inicioPago);
                const fechaHasta = moment(finPago);

                const cantMeses = Math.ceil(fechaHasta.diff(fechaDesde, 'month')) + 1;

                for (let i = 0; i < cantMeses; i++) {
                    /* En caso de que el año sea igual al actual pasa directo sino tiene que ver que el mes del siguiente año sea menor al mes anterior al actual 
                    Esto se hace para verificar que no estamos mostrando un valor que no se va a cobrar al mes actual ya que corresponde al mismo mes pero de otro año*/
                    if (fecha.get('year') === yearHere || (yearHere < fecha.get('year') && fecha.get('month') < (monthHere - 1))) {
                        
                        const month = fecha.get('month') + 1;

                        switch (month) {
                            case 1:
                                mes[0] += 1;
                                break;
                            case 2:
                                mes[1] += 1;
                                break;
                            case 3:
                                mes[2] += 1;
                                break;
                            case 4:
                                mes[3] += 1;
                                break;
                            case 5:
                                mes[4] += 1;
                                break;
                            case 6:
                                mes[5] += 1;
                                break;
                            case 7:
                                mes[6] += 1;
                                break;
                            case 8:
                                mes[7] += 1;
                                break;
                            case 9:
                                mes[8] += 1;
                                break;
                            case 10:
                                mes[9] += 1;
                                break;
                            case 11:
                                mes[10] += 1;
                                break;
                            case 12:
                                mes[11] += 1;
                                break;
                        }
                    }
                    
                    fecha.add(1, 'months').get('month');
                }
            });

            return mes;
        }

        return [];
    }

    const setShowFormSelccion = (form) => {
        setFormulario(form)
        setShowForm(!showForm);
    }

    return (<>
        <ModalFormulario formulario={formulario} show={showForm} informacion={proyecto} setShow={setShowForm} />

        <Row className='content-encabezado'>
            <Row className='content-title'>
                <Col xs={12} md={8} className="titulo-alquileres-vista">{id}</Col>
            </Row>
            <Row className="conten-buttons-agregar">
                {(user.rango == 'admin' || user.rango == "moderador") && <>
                    <Col xs={12} sm={12} md={3}>
                        <button className="button-agregar" onClick={() => setShowFormSelccion('ingresoAlquiler')} variant="dark" >
                            <Icons.Plus className="icon-button" size={19} /> Ingreso a un Alquiler
                        </button>
                    </Col>
                </>}
                <Col xs={6} sm={6} md={1} className='content-referencia'>
                    <Row>
                        <div className='referencia-pagado'></div> Pagado
                    </Row>
                </Col>
                <Col xs={6} sm={6} md={1} className='content-referencia'>
                    <Row>
                        <div className='referencia-falta'></div> Falta pagar
                    </Row>
                </Col>
            </Row>
        </Row>
        <Row>
            {loadingProyectos ?
                <Row className='spinner-center-pag' >
                    <Spinner animation="border" variant="dark" />
                </Row>
                :
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Módulo</th>
                            <th>Ene</th>
                            <th>Feb</th>
                            <th>Mar</th>
                            <th>Abr</th>
                            <th>May</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Ago</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dic</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proyecto && proyecto.alquilers.length > 0 && proyecto.alquilers.map(alquiler =>
                            <tr key={alquiler.id_alquiler}>
                                <td>{`${alquiler.modulo.tipologia}-${alquiler.modulo.id_modulo}`}</td>
                                {
                                    ingresoAlquilerXMes(alquiler.ingreso_alquilers).map((mes, i) =>
                                        <td className={mes >= 1 ? 'state-cobrado' : ( (moment(alquiler.fecha_d_alquiler).get('year') == yearHere && moment(alquiler.fecha_d_alquiler).add(1, 'days').get('month') <= i) && ( moment(alquiler.fecha_h_alquiler).get('year') >= yearHere && moment(alquiler.fecha_h_alquiler).add(1, 'days').get('month') >= i )? 'state-por-cobrar' : '')} key={i}></td>
                                    )
                                }
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
        </Row>
    </>)
}

export default React.memo(IngresosAlquiler)