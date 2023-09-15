import React, { useEffect, useState } from 'react';
import { Button, Card, Col, FloatingLabel, Form, Row, Spinner } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

//Hooks
import { useUser } from '../../../hooks/useUser';
import { useResponse } from '../../../hooks/useResponse';
import { ToastComponent, calcCantMeses, desformatNumber, formatFecha, formatNumber, formatFechaISO } from '../../../hooks/useUtils';

//Componets
import ValidacionIngresoAlquiler from '../../utils/modal/validacion/ValidacionIngresoAlquiler';

//Service
import { editApiIngresoAlquiler } from '../../../services/apiIngresoAlquiler';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getProyectos } from '../../../redux/slice/Proyecto/thunks';

const FormEditIngresoAlquiler = ({ close, updateEditIngresoAlquiler }) => {
    const { user } = useUser();

    const dispatch = useDispatch();
    const { response } = useResponse();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);

    const [dataIngreso, setDataIngreso] = useState({
        id_ingreso_alquiler: updateEditIngresoAlquiler ? updateEditIngresoAlquiler.id_ingreso_alquiler : '',
        id_proyecto: updateEditIngresoAlquiler ? updateEditIngresoAlquiler.id_proyecto : '',
        id_alquiler: updateEditIngresoAlquiler ? updateEditIngresoAlquiler.id_alquiler : '',
        nombre_modulo: updateEditIngresoAlquiler.modulo ? `${updateEditIngresoAlquiler.modulo.tipologia} - ${updateEditIngresoAlquiler.modulo.id_modulo} - ${formatNumber(updateEditIngresoAlquiler.modulo.ancho)} x ${formatNumber(updateEditIngresoAlquiler.modulo.largo)} - ${updateEditIngresoAlquiler.modulo.material_cerramiento} ` : '',
        nombre_modulo_doble: updateEditIngresoAlquiler.modulo_doble ? `OD - ${updateEditIngresoAlquiler.modulo_doble.id_modulo_doble} - OS - ${updateEditIngresoAlquiler.modulo_doble.id_modulo_uno} - OS - ${updateEditIngresoAlquiler.modulo_doble.id_modulo_dos} }` : '',
        fecha_desde_cobro: updateEditIngresoAlquiler ? formatFechaISO(updateEditIngresoAlquiler.fecha_desde_cobro) : '',
        fecha_hasta_cobro: updateEditIngresoAlquiler ? formatFechaISO(updateEditIngresoAlquiler.fecha_hasta_cobro) : '',
        valor_arg: updateEditIngresoAlquiler ? updateEditIngresoAlquiler.valor_arg : '',
        valor_usd: updateEditIngresoAlquiler ? updateEditIngresoAlquiler.valor_usd : '',
        observaciones: updateEditIngresoAlquiler ? updateEditIngresoAlquiler.observaciones : '',
        factura: updateEditIngresoAlquiler ? updateEditIngresoAlquiler.factura : '',
        id_user: user.id,
    });

    const [dataAlquiler, setDataAlquiler] = useState({
        fecha_desde_alquiler: '',
        fecha_hasta_alquiler: '',
        valor_alquiler: '',
    });

    const [cantMesesAlquiler, setCantMesesAlquiler] = useState(0);

    const [showModal, setShowModal] = useState(false);

    //Checks
    const [checkUSD, setCheckUSD] = useState(updateEditIngresoAlquiler && updateEditIngresoAlquiler.valor_usd ? 1 : 0);

    //Variables para la validacion
    const [validated, setValidated] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const alquiler = proyectos.find(proyectoFind => proyectoFind.id_proyecto === updateEditIngresoAlquiler.id_proyecto).alquilers.find(alquilerFind => alquilerFind.id_alquiler == updateEditIngresoAlquiler.id_alquiler);

        const cantMesesAlquiler = calcCantMeses(alquiler.fecha_d_alquiler, alquiler.fecha_h_alquiler)

        setCantMesesAlquiler(cantMesesAlquiler);

        setDataAlquiler(prevDataAlquiler => ({
            ...prevDataAlquiler,
            fecha_desde_alquiler: formatFechaISO(alquiler.fecha_d_alquiler),
            fecha_hasta_alquiler: formatFechaISO(alquiler.fecha_h_alquiler),
            valor_alquiler: alquiler.valor,
        }))
        return () => { }
    }, [proyectos])


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
        } else if (targetName.includes('fecha_')) {

            const cantMesesACobrar = calcCantMeses(targetName === 'fecha_desde_cobro' ? targetValue : dataIngreso.fecha_desde_cobro, targetName === 'fecha_hasta_cobro' ? targetValue : dataIngreso.fecha_hasta_cobro);

            const valorXMes = dataAlquiler.valor_alquiler / cantMesesAlquiler;

            const new_fecha_ingreso_desde = targetName === 'fecha_desde_cobro' ? targetValue : dataIngreso.fecha_desde_cobro;
            const new_fecha_ingreso_hasta = targetName === 'fecha_hasta_cobro' ? targetValue : dataIngreso.fecha_hasta_cobro;

            if (new_fecha_ingreso_hasta <= dataAlquiler.fecha_hasta_alquiler && new_fecha_ingreso_hasta >= dataAlquiler.fecha_desde_alquiler &&
                new_fecha_ingreso_desde >= dataAlquiler.fecha_desde_alquiler && new_fecha_ingreso_desde <= dataAlquiler.fecha_hasta_alquiler
            ) {
                setDataIngreso(prevDataIngreso => ({
                    ...prevDataIngreso,
                    valor_arg: checkUSD ? 0 : formatNumber(valorXMes * cantMesesACobrar),
                    valor_usd: checkUSD ? formatNumber(valorXMes * cantMesesACobrar) : 0,
                    [targetName]: targetValue
                }))
            } else {
                ToastComponent('warn', 'Ojo! Te estas saliendo del rango de fechas del alquiler')
            }
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
            resIngresoAlquiler = await editApiIngresoAlquiler(dataIngreso);

            setShowSpinner(true);

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
                setShowSpinner(false);

                close();
            } else {
                setShowSpinner(false);
                ToastComponent('error', resIngresoAlquiler.data.todoMal && resIngresoAlquiler.data.todoMal);
            }
        } catch (error) {
            setShowSpinner(false);
            console.error(error);
            ToastComponent('error');
        }
    }

    return (
        <Row className="justify-content-center">
            {showModal === true &&
                <ValidacionIngresoAlquiler mostrar={showModal} datos={dataIngreso} setShow={setShowModal} setSubmit={handleSubmit} />
            }

            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form mobile-form">
                    {!close && <Card.Header className="title-form" >Editar Ingreso</Card.Header>}
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleValidacion} >
                            <Form.Label>{dataIngreso.id_proyecto}</Form.Label>
                            <Form.Label>{dataIngreso.nombre_modulo || dataIngreso.nombre_modulo_doble}</Form.Label>
                            <Form.Label>{`${formatFecha(dataAlquiler.fecha_desde_alquiler)} al ${formatFecha(dataAlquiler.fecha_hasta_alquiler)}`}</Form.Label>
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
                                <FloatingLabel label={`Importe por ${calcCantMeses(dataIngreso.fecha_desde_cobro, dataIngreso.fecha_hasta_cobro)} ${calcCantMeses(dataIngreso.fecha_desde_cobro, dataIngreso.fecha_hasta_cobro) == 1 ? 'mes' : 'meses'}`}>
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
                            <Button className="button-submit" variant="dark" type="submit" disabled={showSpinner}>
                                {showSpinner ? <Spinner animation="border" variant="light" size='sm' /> : "Guardar"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default React.memo(FormEditIngresoAlquiler)