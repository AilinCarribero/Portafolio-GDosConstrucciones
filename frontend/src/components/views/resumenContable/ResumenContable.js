import moment from 'moment';
import React, { useEffect } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getCantModulos } from '../../../redux/slice/Modulo/thunks';

//Hooks
import { formatNameMes, formatNumber } from '../../../hooks/useUtils';

const ResumenContable = ({ Totales }) => {
    const dispatch = useDispatch();

    const mesActual = formatNameMes(moment().month());

    const alquilerXMes = useSelector(state => state.proyectoRedux.alquilerXMes);
    const totalAlquieres = useSelector(state => state.proyectoRedux.totalAlquieres);
    const totalVigente = useSelector(state => state.proyectoRedux.totalVigente);
    const loadingProyectos = useSelector(state => state.proyectoRedux.loading);

    const cantidadesModulos = useSelector(state => state.moduloRedux.cantidades);
    const loadingModulos = useSelector(state => state.moduloRedux.loading);


    useEffect(() => {
        dispatch(getCantModulos());
    }, [])

    return (
        <Row className="content-resumen">
            <Col xs={12} md={6} className="content-section" >
                Alquileres
                <Row>
                    <Col xs={6} md={6} >Acumulado:</Col>
                    <Col xs={6} md={6} >
                        {loadingProyectos ? <Spinner animation="border" variant="light" size='sm' /> : `$${formatNumber(totalAlquieres)}`}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >Vigente:</Col>
                    <Col xs={6} md={6} >
                        {loadingProyectos ? <Spinner animation="border" variant="light" size='sm' /> : `$${formatNumber(totalVigente)}`}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >Total de {mesActual}:</Col>
                    <Col xs={6} md={6} >
                        {loadingProyectos ? <Spinner animation="border" variant="light" size='sm' /> : `$${formatNumber(alquilerXMes[mesActual])}`}
                    </Col>
                </Row>
            </Col>
            <Col xs={12} md={6} className="content-section" >
                Módulos
                <Row>
                    <Col xs={6} md={6} >Cantidad de Unidades:</Col>
                    <Col xs={6} md={6} >
                        {loadingModulos ? <Spinner animation="border" variant="light" size='sm' /> : `${formatNumber(cantidadesModulos.total)}`}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >En Uso:</Col>
                    <Col xs={6} md={6} >
                        {loadingModulos ? <Spinner animation="border" variant="light" size='sm' /> : `${formatNumber(cantidadesModulos.ocupados)}`}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >Disponibles:</Col>
                    <Col xs={6} md={6} >
                        {loadingModulos ? <Spinner animation="border" variant="light" size='sm' /> : `${formatNumber(cantidadesModulos.disponibles)}`}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >En Espera:</Col>
                    <Col xs={6} md={6} >
                        {loadingModulos ? <Spinner animation="border" variant="light" size='sm' /> : `${formatNumber(cantidadesModulos.en_espera)}`}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default React.memo(ResumenContable)