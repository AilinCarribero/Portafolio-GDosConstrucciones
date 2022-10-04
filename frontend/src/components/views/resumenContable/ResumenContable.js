import moment from 'moment';
import React, {useEffect} from 'react';
import { Col, Row } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';

//Redux
import { useDispatch, useSelector } from 'react-redux';

//Hooks
import { formatNameMes, formatNumber } from '../../../hooks/useUtils';
import { getCantModulos } from '../../../redux/slice/Modulo/thunks';

const ResumenContable = ({ Totales }) => {
    const dispatch = useDispatch();

    const mesActual = formatNameMes(moment().month());

    const alquilerXMes = useSelector(state => state.proyectoRedux.alquilerXMes);
    const totalAlquieres = useSelector(state => state.proyectoRedux.totalAlquieres);
    const totalVigente = useSelector(state => state.proyectoRedux.totalVigente);
    const cantidadesModulos = useSelector(state => state.moduloRedux.cantidades);

    useEffect(() => {
      dispatch(getCantModulos());
    }, [])
    
    return (
        <Row className="content-resumen">
            <Col xs={12} md={4} className="content-section" >
                Proyectos
                <Row>
                    <Col xs={6} md={6} >
                        Costos:
                    </Col>
                    <Col xs={6} md={6} >
                        ${formatNumber(Totales.costos)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >
                        Venta:
                    </Col>
                    <Col xs={6} md={6} >
                        ${formatNumber(Totales.ventas)}
                    </Col>
                </Row>
            </Col>
            <Col xs={12} md={4} className="content-section" >
                Alquileres
                <Row>
                    <Col xs={6} md={6} >Acumulado:</Col>
                    <Col xs={6} md={6} >
                        ${formatNumber(totalAlquieres)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >Vigente:</Col>
                    <Col xs={6} md={6} >
                        ${formatNumber(totalVigente)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >Mensual:</Col>
                    <Col xs={6} md={6} >
                        ${formatNumber(alquilerXMes[mesActual])}
                    </Col>
                </Row>
            </Col>
            <Col xs={12} md={4} className="content-section" >
                Módulos
                <Row>
                    <Col xs={6} md={6} >Cantidad de Unidades:</Col>
                    <Col xs={6} md={6} >
                        {formatNumber(cantidadesModulos.total)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >En Uso:</Col>
                    <Col xs={6} md={6} >
                        {formatNumber(cantidadesModulos.ocupados)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >Disponibles:</Col>
                    <Col xs={6} md={6} >
                        {formatNumber(cantidadesModulos.disponibles)}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default React.memo(ResumenContable)