import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

//Hooks
import { useGetFormasCobro } from '../../../hooks/useFormasCobro';
import { useGetProyectos } from '../../../hooks/useProyectos';
import { useUser } from '../../../hooks/useUser';
import { desformatNumber, formatFecha, formatFechaISO, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useGetCentroCosto } from '../../../hooks/useCentroCosto';
import { useResponse } from '../../../hooks/useResponse';

//Servicios
import { insertApiIngresoAlquiler } from '../../../services/apiIngresoAlquiler';

//Componentes
import ValidacionIngresoAlquiler from '../../utils/modal/validacion/ValidacionIngresoAlquiler';
import { getProyectos } from '../../../redux/slice/Proyecto/thunks';

//Css

const FormIngresosAlquiler = ({ close, updateIngresoAlquiler }) => {
    const { user } = useUser();

    const dispatch = useDispatch();
    const { response } = useResponse();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);

    const [dataIngreso, setDataIngreso] = useState({
        id_proyecto: updateIngresoAlquiler ? updateIngresoAlquiler.id_proyecto : '',
        id_alquiler: '',
        nombre_modulo: '',
        nombre_modulo_doble: '',
        id_user: '',
        fecha_desde_cobro: '',
        fecha_hasta_cobro: '',
        valor_arg: '',
        valor_usd: '',
        observaciones: '',
        factura: '',
        id_user: user.id,
    });

    //console.log(proyectos)
    //Checks
    const [checkUSD, setCheckUSD] = useState(updateIngresoAlquiler && updateIngresoAlquiler.valor_usd ? 1 : 0);

    const [showModal, setShowModal] = useState(false);

    //Variables para la validacion
    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetType = e.target.type;
        const targetCheck = e.target.checked;

        if (targetType === 'radio') {
            if (targetName === 'dolares') {
                setCheckUSD(1);

                setDataIngreso(prevDataIngreso => ({
                    ...prevDataIngreso,
                    valor_arg: 0
                }))
            } else {
                setCheckUSD(0);

                setDataIngreso(prevDataIngreso => ({
                    ...prevDataIngreso,
                    valor_usd: 0
                }))
            }
        } if(targetName === 'id_alquiler') {
            const alquiler = proyectos.find(proyectoFind => proyectoFind.id_proyecto === dataIngreso.id_proyecto).alquilers.find(alquilerFind => alquilerFind.id_alquiler == targetValue);

            setDataIngreso(prevDataIngreso => ({
                ...prevDataIngreso,
                fecha_desde_cobro: formatFechaISO(alquiler.fecha_d_alquiler),
                fecha_hasta_cobro: formatFechaISO(alquiler.fecha_h_alquiler),
                [targetName]: targetValue,
            }))
        } else {
            setDataIngreso(prevDataIngreso => ({
                ...prevDataIngreso,
                [targetName]: targetValue
            }))
        }

    }

    const handleValidacion = (e) => {
        e.preventDefault();
        const auxIngreso = [];

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            const alquiler = proyectos.find(proyectoFind => proyectoFind.id_proyecto === dataIngreso.id_proyecto).alquilers.find(alquilerFind => alquilerFind.id_alquiler == dataIngreso.id_alquiler);

            setDataIngreso(prevDataIngreso => ({
                ...prevDataIngreso,
                valor_arg: desformatNumber(dataIngreso.valor_arg),
                valor_usd: desformatNumber(dataIngreso.valor_usd),
                nombre_modulo: alquiler.modulo && `${alquiler.modulo.tipologia} - ${alquiler.modulo.id_modulo} - ${formatNumber(alquiler.modulo.ancho)} x ${formatNumber(alquiler.modulo.largo)} - ${alquiler.modulo.material_cerramiento}`,
                nombre_modulo_doble: alquiler.modulo_doble && `OD - ${alquiler.modulo_doble.id_modulo_doble} - OS - ${alquiler.modulo_doble.id_modulo_uno} - OS - ${alquiler.modulo_doble.id_modulo_dos} `
            }));

            setShowModal(true)
        }
    }

    const handleSubmit = async () => {
        let resIngresoAlquiler = [];

        try {
            resIngresoAlquiler = await insertApiIngresoAlquiler(dataIngreso);

            const res = response(resIngresoAlquiler);

            if (res) {
                ToastComponent('success');

                setDataIngreso({
                    id_proyecto: '',
                    id_alquiler: '',
                    nombre_modulo: '',
                    nombre_modulo_doble: '',
                    id_user: '',
                    fecha_desde_cobro: '',
                    fecha_hasta_cobro: '',
                    valor_arg: '',
                    valor_usd: '',
                    observaciones: '',
                    factura: '',
                    id_user: '',
                })

                setShowModal(false);
                dispatch(getProyectos());

                close();
            } else {
                ToastComponent('error', resIngresoAlquiler.data.todoMal && resIngresoAlquiler.data.todoMal);
            }
        } catch (error) {
            console.error(error);
            ToastComponent('error');
        }
    }

    return (
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form mobile-form">
                    {!close && <Card.Header className="title-form" >Ingreso</Card.Header>}
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleValidacion} >
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Eligue el proyecto">
                                    <Form.Select onChange={handleChangeForm} name="id_proyecto" value={dataIngreso.id_proyecto} required >
                                        <option value=""> </option>
                                        {
                                            proyectos.filter(filterProyecto => filterProyecto.alquilers.length > 0)
                                                .map((proyecto) => (
                                                    <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                                                        {proyecto.id_proyecto}
                                                    </option>
                                                ))
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                            {dataIngreso.id_proyecto &&
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Eligue el módulo">
                                        <Form.Select onChange={handleChangeForm} name="id_alquiler" value={dataIngreso.id_alquiler} >
                                            <option value=""> </option>
                                            {
                                                proyectos.find(filterProyecto => filterProyecto.id_proyecto === dataIngreso.id_proyecto)
                                                    .alquilers.map((alquiler) => (
                                                        alquiler.id_modulo &&
                                                        <option key={alquiler.id_alquiler} value={alquiler.id_alquiler}>
                                                            {`${alquiler.modulo.tipologia} - ${alquiler.modulo.id_modulo} - ${formatNumber(alquiler.modulo.ancho)} x ${formatNumber(alquiler.modulo.largo)} - ${alquiler.modulo.material_cerramiento} Fecha: ${formatFecha(alquiler.fecha_d_alquiler)} al ${formatFecha(alquiler.fecha_h_alquiler)}`}
                                                        </option>
                                                    ))
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            {dataIngreso.id_proyecto &&
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Eligue el módulo doble">
                                        <Form.Select onChange={handleChangeForm} name="id_alquiler" value={dataIngreso.id_alquiler} >
                                            <option value=""> </option>
                                            {
                                                proyectos.find(filterProyecto => filterProyecto.id_proyecto === dataIngreso.id_proyecto)
                                                    .alquilers.map((alquiler) => (
                                                        alquiler.id_modulo_doble &&
                                                        <option key={alquiler.id_alquiler} value={alquiler.id_alquiler}>
                                                            {`OD - ${alquiler.modulo_doble.id_modulo_doble} - OS - ${alquiler.modulo_doble.id_modulo_uno} - OS - ${alquiler.modulo_doble.id_modulo_dos} Fecha: ${formatFecha(alquiler.fecha_d_alquiler)} al ${formatFecha(alquiler.fecha_h_alquiler)}`}
                                                        </option>
                                                    ))
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            }
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha Desde Donde se va a Cobrar">
                                    <Form.Control onChange={handleChangeForm} name="fecha_desde_cobro" type="date" value={dataIngreso.fecha_desde_cobro} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha Hasta Donde se va a Cobrar">
                                    <Form.Control onChange={handleChangeForm} name="fecha_hasta_cobro" type="date" value={dataIngreso.fecha_hasta_cobro} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Row key={`inline-radio`} className="check">
                                    <Col xs={4} sm={4} >
                                        <Form.Check inline onChange={handleChangeForm} label="ARG$" name="pesos" value="0" type="radio" checked={checkUSD == '0'} />
                                    </Col>
                                    <Col xs={8} sm={8} >
                                        <Form.Check inline onChange={handleChangeForm} label="USD$" name="dolares" value="1" type="radio" checked={checkUSD == '1'} />
                                    </Col>
                                </Row>
                                <FloatingLabel label="Importe">
                                    <NumericFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChangeForm} name={checkUSD == 0 ? "valor_arg" : "valor_usd"} value={checkUSD == 0 ? dataIngreso.valor_arg : dataIngreso.valor_usd} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Factura Tipo N°">
                                    <Form.Control onChange={handleChangeForm} name="factura" value={dataIngreso.factura} type="text" required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Detalle">
                                    <Form.Control onChange={handleChangeForm} name="observaciones" value={dataIngreso.observaciones} type="text" />
                                </FloatingLabel>
                            </Form.Group>

                            {showModal === true &&
                                <ValidacionIngresoAlquiler mostrar={showModal} datos={dataIngreso} setShow={setShowModal} setSubmit={handleSubmit} />
                            }

                            <Button className="button-submit" variant="dark" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default React.memo(FormIngresosAlquiler)