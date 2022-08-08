import React, { useState } from "react";
import { Row, Col, Form, FloatingLabel } from 'react-bootstrap';

//Hooks
//import { useFiltros } from "../../../hooks/useFiltros";

//Redux
import { useDispatch } from "react-redux";
import { addFiltros } from "../../../redux/slice/Proyecto/proyectoSlice";
import { activeFiltros } from "../../../redux/slice/Proyecto/thunks";

//Css-img-icons
import './Filtros.css';

const FiltrosProyectos = ({ show }) => {
    //const { handleFiltros } = useFiltros();
    const dispatch = useDispatch();

    //const [showCobro, setShowCobro] = useState(false);
    //const [showPago, setShowPago] = useState(false);

    const handleChangeShowFiltros = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        /*Si se selecciona el check de cobros se debe mostrar/ocultar los filtros de fechas correspondientes a cobros*/
        /*if (targetName == 'cobro') {
            if (targetCheck == true) {
                setShowCobro(true);
            } else {
                setShowCobro(false);
            }
        }*/

        /*Si se selecciona el check de pagos se debe mostrar/ocultar los filtros de fechas correspondientes a pagos*/
        /*if (targetName == 'pago') {
            if (targetCheck == true) {
                setShowPago(true);
            } else {
                setShowPago(false);
            }
        }*/
    }

    const handleFiltros = (e) => {
        let targetName = e.target.name;
        let targetValue = e.target.value;

        dispatch(addFiltros({ [targetName]: targetValue }));
    }

    /***FALTA --->>> boton para limpiar los filtros***/
    return (<>
        <Row hidden={show} className="cont-filtros">
            {/*<Row className="check-box-row">
                <Col xs={6} sm={3} >
                    <Form.Check inline onChange={handleChangeShowFiltros} label="Fechas para Cobros" name="cobro" value="cobro" type="checkbox" />
                </Col>
                <Col xs={6} sm={3} >
                    <Form.Check inline onChange={handleChangeShowFiltros} label="Fechas para Pagos" name="pago" value="pago" type="checkbox" />
                </Col>
            </Row>*/}
            <Col xs={12} sm={12}>
                <Form.Label className="title-fechas-filtros">FILTROS PARA PROYECTOS</Form.Label>
            </Col>
            <Col xs={12} sm={6}>
                <Col xs={12} sm={12}>
                    <Form.Label className="title-fechas-filtros">Fecha de Cobros/Ingresos Realizados</Form.Label>
                </Col>
                <Row>
                    <Col xs={12} sm={6} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Desde fecha de Cobro">
                            <Form.Control onChange={handleFiltros} name="fecha_cobro_desde" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={6} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Hasta fecha de Cobro">
                            <Form.Control onChange={handleFiltros} name="fecha_cobro_hasta" type="date" />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Col>
            <Col xs={12} sm={6}>
                <Col xs={12} sm={12}>
                    <Form.Label className="title-fechas-filtros">Fechas de Pagos/Egresos Realizados</Form.Label>
                </Col>
                <Row>
                    <Col xs={12} sm={6} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Desde fecha de Pago">
                            <Form.Control onChange={handleFiltros} name="fecha_pago_desde" type="date" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={12} sm={6} className="input-filter">
                        <FloatingLabel className="text-filtros-title-input" controlId="floatingInputGrid" label="Hasta fecha de Pago">
                            <Form.Control onChange={handleFiltros} name="fecha_pago_hasta" type="date" />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Col>

        </Row>
    </>)
}

export default React.memo(FiltrosProyectos);