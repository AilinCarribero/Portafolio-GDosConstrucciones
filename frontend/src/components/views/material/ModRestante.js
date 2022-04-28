import React, { useState } from "react";
import { Form, Button, Modal, FloatingLabel, Row, Col } from "react-bootstrap";
import Decimal from 'decimal.js-light';

//Components
import NumberFormat from "react-number-format";
import ValidacionMaterial from "../../utils/modal/validacion/ValidacionMaterial";

//Hooks
import { ToastComponent, formatNumber, desformatNumber } from "../../../hooks/useUtils";
import { useUser } from "../../../hooks/useUser";
import { useGetFormasPagos } from "../../../hooks/useFormasPagos";
import { useGetComprobantesPago } from "../../../hooks/useComprobantePago";
import { useGetProyectos } from "../../../hooks/useProyectos";

//Services
import { updateStock } from "../../../services/apiStock";

const ModRestante = ({ show, stock, setShow, setStock }) => {
    const { user } = useUser();
    const { formasPagos } = useGetFormasPagos();
    const { comprobantePago } = useGetComprobantesPago();
    const { proyectos } = useGetProyectos();

    /*Declaracion de variables de fecha*/
    const newDate = new Date();
    const año = newDate.getFullYear();
    const dia = newDate.getDate();
    const proyectosCC = proyectos ? proyectos.filter((proyecto) => proyecto.id_proyecto.includes("CCC") || proyecto.id_proyecto.includes("CCE")) : [];

    const [cambiar, setCambiar] = useState({
        nombre_stock: stock.nombre_stock,
        id_stock: stock.id_stock,
        restante_valor: stock.restante_valor,
        valor: stock.valor,
        valor_unidad: 0,
        cantidad: 0,
        valor_pago: 0,
        restante_total: 0,
        id_forma_pago: '',
        fecha_pago: new Date().toISOString().slice(0, 10),
        fecha_diferido_pago: '',
        observaciones: '',
        id_comprobante_pago: '',
        numero_comprobante: '',
        id_user: stock.usuario.id_user,
        proyecto: ''
    });
    console.log(stock)
    //Variables con informacion
    const [cantCheque, setCantCheque] = useState(0);
    const [cheques, setCheques] = useState();

    //Checks
    const [checkComprobante, setCheckComprobante] = useState();

    //Variables para validacion
    const [validated, setValidated] = useState(false);

    //Envio para modal de validacion
    const [datosValidacion, setDatosValidacion] = useState([]);
    const [auxCambiar, setAuxCambiar] = useState([]);

    //Eventos para mostrar partes del formulario
    const [showCuotas, setShowCuotas] = useState(false);
    const [showFechaDif, setShowFechaDif] = useState(false);
    const [showCheque, setShowCheque] = useState(false);
    const [showDataCheques, setShowDataCheques] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        if (targetName == 'cantCheque') {
            setCantCheque(targetValue);
            setShowDataCheques(true);
        } else if (targetName.indexOf('fechaD') > -1 || targetName.indexOf('monto') > -1) {
            setCheques(prevCheques => ({
                ...prevCheques,
                [targetName]: targetValue
            }))
        } else if (targetCheck) {
            setCheckComprobante(targetValue);
            setCambiar(prevCambiar => ({
                ...prevCambiar,
                [targetName]: targetValue
            }))
        } else if (targetName == "valor_unidad" || targetName == "cantidad") {
            const auxNumero = desformatNumber(targetValue);

            /* Si lo que se esta ingresando es un valor de unidad entonces se debe multiplicar por la cantidad que esta guardado, 
            en caso de que se este ingresando la cantidad entonces el valor unitario que esta guardado debe multiplicarse por la 
            cantidad que se esta ingresando */
            const auxValorPago = targetName == "valor_unidad" ? auxNumero * cambiar.cantidad : cambiar.valor_unidad * auxNumero;

            const auxNewRestante = cambiar.restante_valor && auxValorPago && new Decimal(cambiar.restante_valor).add(auxValorPago).toNumber(); //Valor que va a quedar disponible
            const auxNewValorTotal = cambiar.valor && auxValorPago && new Decimal(cambiar.valor).add(auxValorPago).toNumber(); //Valor total que se ha ingresado

            setCambiar(prevCambiar => ({
                ...prevCambiar,
                [targetName]: auxNumero,
                valor_pago: auxValorPago, //Valor que se esta pagando
                restante_total: auxNewRestante,
                new_valor_total: auxNewValorTotal
            }));
        } else {
            setCambiar(prevCambiar => ({
                ...prevCambiar,
                [targetName]: targetValue
            }))
        }
        //Si se selecciono una forma de pago y...
        if (targetName === 'id_forma_pago') {
            formasPagos.forEach((formaPago) => {
                if (formaPago.id_forma_pago == targetValue) {
                    /* La forma de pago mediante tarjeta de credito se maneja diferente al resto */
                    setShowCuotas(formaPago.forma_pago === 'Tarjeta de Credito' ? true : false) //... es tarjeta de credito se debe mostrar la seleccion de cuotas
                    setShowCheque(formaPago.forma_pago === 'E-Cheq' || formaPago.forma_pago === 'C.P.D. - Cheque de Pago Diferido' ? true : false);//... si es un cheque debe mostrar un campo para ingresar la cantidad de cheques
                    setShowDataCheques(false);
                    setShowFechaDif(formaPago.requiere_f_pago === 1
                        && formaPago.forma_pago !== 'Tarjeta de Credito'
                        && formaPago.forma_pago !== 'E-Cheq'
                        && formaPago.forma_pago !== 'C.P.D. - Cheque de Pago Diferido'
                        ? true : false) //... requiere una fecha diferente a la actual mostrar otro campo de fecha
                }
            })
        }
    }

    const handleValidacion = (e) => {
        e.preventDefault();
        const auxValuesCambiar = [];

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            /*En caso de tener cuotas el valor del importe debe dividirse en partes iguales acorde a la cantidad de cuotas 
            seleccionadas y se debera diferir cada cuota a 30 dias despues de la siguiente */
            if (cambiar.cuota > 0) {
                const valorCuota = cambiar.valor_pago ? (cambiar.valor_pago / cambiar.cuota) : 0;

                if (valorCuota !== 0) {
                    for (let i = 0; i < cambiar.cuota; i++) {
                        const mesD = newDate.getMonth() + i + 1;

                        auxValuesCambiar[i] = {
                            ...cambiar,
                            cuotaNumero: i,
                            restante_valor: cambiar.valor_pago,
                            valor: cambiar.valor_pago,
                            valor_pago: valorCuota,
                            fecha_diferido_pago: new Date(año, mesD, dia).toISOString().slice(0, 10)
                        }
                    }
                }
                setAuxCambiar(auxValuesCambiar);
                setDatosValidacion(auxValuesCambiar);
                setShowModal(true);
            } else if (cheques && cantCheque > 0) {
                /*Si existen cheques entonces guardar en una variable aux los datos de ingreso + los datos del cheque*/
                for (let i = 0; i < cantCheque; i++) {
                    const auxChequeFD = cheques['fechaD' + i];
                    const auxChequeM = desformatNumber(cheques['monto' + i]);

                    auxValuesCambiar[i] = {
                        ...cambiar,
                        valor_pago: auxChequeM,
                        restante_valor: cambiar.valor_pago,
                        valor: cambiar.valor_pago,
                        fecha_diferido_pago: auxChequeFD,
                        cheque: i
                    }
                }
                setAuxCambiar(auxValuesCambiar);
                setDatosValidacion(auxValuesCambiar);
                setShowModal(true);
            } else {
                //Si no hay cuotas el proceso de guardado es normal
                const material = {
                    ...cambiar,
                    restante_valor: cambiar.valor_pago,
                    valor: cambiar.valor_pago
                }

                setDatosValidacion(material);
                setAuxCambiar(material);
                setShowModal(true);
            }
        }
    }

    const handleSubmit = async () => {
        let resUpdateStock = [];

        try {
            resUpdateStock = await updateStock(auxCambiar);
        } catch (error) {
            ToastComponent('error');
        }

        if ((resUpdateStock.data.todoOk == 'Ok' || resUpdateStock.statusText == 'OK' || resUpdateStock.status == 200) && !resUpdateStock.data.todoMal) {
            ToastComponent('success');

            setStock(resUpdateStock.data);
            setCambiar({
                nombre_stock: '',
                id_stock: '',
                restante_valor: 0,
                valor: 0,
                valor_unidad: 0,
                cantidad: 0,
                valor_pago: 0,
                restante_total: 0,
                id_forma_pago: '',
                fecha_pago: new Date().toISOString().slice(0, 10),
                fecha_diferido_pago: '',
                observaciones: '',
                id_comprobante_pago: '',
                numero_comprobante: '',
                id_user: '',
                proyecto: ''
            });
            setShow(false);
        } else {
            ToastComponent('error');
        }
    }

    const dataChequeForm = () => {
        if (showDataCheques == true) {
            let rows = [];
            for (let i = 0; i < cantCheque; i++) {
                rows.push(
                    <Row key={i}>
                        <Col xs={6} sm={6}>
                            <FloatingLabel controlId="floatingInputGrid" label="Fecha Del Cheque">
                                <Form.Control onChange={handleChange} name={"fechaD" + i} type="date" required />
                            </FloatingLabel>
                        </Col>
                        <Col xs={6} sm={6}>
                            <FloatingLabel controlId="floatingInputGrid" label="Monto del Cheque">
                                <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                    onChange={handleChange} name={"monto" + i} required />
                            </FloatingLabel>
                        </Col>
                    </Row>
                )
            }
            return rows
        }
    }


    return (<>
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <b>Ingresa el nuevo valor</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                <Form noValidate validated={validated} onSubmit={handleValidacion}>
                    <Form.Group className="mb-3" >
                        <FloatingLabel label="Centro de Costo">
                            <Form.Select onChange={handleChange} name="proyecto" value={cambiar.proyecto} required >
                                <option value=""> </option>
                                {
                                    proyectosCC.map((proyecto) => (
                                        <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                                            {proyecto.id_proyecto}
                                        </option>
                                    ))
                                }
                            </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="Cantidad" className="mb-3">
                                    <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChange} name={"cantidad"}
                                        value={cambiar.cantidad} required />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInput" label="Valor Unitario" className="mb-3">
                                    <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChange} name="valor_unidad"
                                        value={cambiar.valor_unidad} required />
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} className="text-total">
                            <Row>
                                <Form.Text>
                                    Valor Unitario (${formatNumber(cambiar.valor_unidad)}) x Cantidad ({formatNumber(cambiar.cantidad)}) = ${formatNumber(cambiar.valor_pago)}
                                </Form.Text>
                            </Row>
                            <Row>
                                <Form.Text>
                                    Disponible (${formatNumber(cambiar.restante_valor)}) + Agregando (${formatNumber(cambiar.valor_pago)}) = ${formatNumber(cambiar.restante_total)} quedará disponible
                                </Form.Text>
                            </Row>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" >
                        <FloatingLabel label="Forma en que se realizo el pago">
                            <Form.Select onChange={handleChange} name="id_forma_pago" value={cambiar.id_forma_pago} required>
                                <option value=""></option>
                                {formasPagos.map((formaPago) => (
                                    <option key={formaPago.id_forma_pago} value={formaPago.id_forma_pago}>
                                        {formaPago.forma_pago}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <FloatingLabel controlId="floatingInputGrid" label="Fecha Del Pago">
                            <Form.Control onChange={handleChange} name="fecha_pago" type="date" value={cambiar.fecha_pago} required />
                        </FloatingLabel>
                    </Form.Group>
                    {showCuotas && <>
                        <Form.Group className="mb-3" >
                            <FloatingLabel label="Cantidad de cuotas">
                                <Form.Select onChange={handleChange} name="cuota">
                                    <option value={0}></option>
                                    <option value={1}>1 Cuota</option>
                                    <option value={3}>3 Cuotas</option>
                                    <option value={6}>6 Cuotas</option>
                                    <option value={9}>9 Cuotas</option>
                                    <option value={12}>12 Cuotas</option>
                                    <option value={16}>16 Cuotas</option>
                                    <option value={18}>18 Cuotas</option>
                                    <option value={24}>24 Cuotas</option>
                                    <option value={30}>30 Cuotas</option>
                                </Form.Select>
                            </FloatingLabel>
                            {cambiar.cuota &&
                                <Form.Text className="text-small">
                                    Cuotas de ${formatNumber(cambiar.valor_pago / cambiar.cuota)} c/u
                                </Form.Text>
                            }
                        </Form.Group>
                    </>}
                    {showCheque &&
                        <Form.Group className="mb-3">
                            <FloatingLabel label="Cantidad de Cheques">
                                <Form.Control onChange={handleChange} name="cantCheque" type="number" value={cantCheque} required />
                            </FloatingLabel>
                        </Form.Group>
                    }
                    {showDataCheques &&
                        <Form.Group className="mb-3">
                            {dataChequeForm()}
                        </Form.Group>
                    }
                    {showFechaDif &&
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInputGrid" label="Fecha Diferido">
                                <Form.Control onChange={handleChange} name="fecha_diferido_pago" type="date" value={cambiar.fecha_diferido_pago} required />
                            </FloatingLabel>
                        </Form.Group>
                    }
                    <Form.Group className="mb-3">
                        <Form.Label className="label-title">Detalle</Form.Label>
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInputGrid" label="Proveedor">
                                <Form.Control onChange={handleChange} name="proveedor" type="text" value={cambiar.proveedor} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInputGrid" label="Observaciones">
                                <Form.Control onChange={handleChange} name="observaciones" type="text" value={cambiar.observaciones} />
                            </FloatingLabel>
                        </Form.Group>
                        <Row key={`inline-radio`} className="check">
                            <Col xs={4} sm={4} >
                                <Form.Check inline onChange={handleChange} label="Factura" name="comprobante" value="Factura" type="radio" checked={checkComprobante == 'Factura'} />
                            </Col>
                            <Col xs={8} sm={8} >
                                <Form.Check inline onChange={handleChange} label="Comprobante de Pago" name="comprobante" value="Comprobante de Pago" type="radio" checked={checkComprobante == 'Comprobante de Pago'} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} sm={4}>
                                <FloatingLabel label="Tipo">
                                    <Form.Select onChange={handleChange} name="id_comprobante_pago" value={cambiar.id_comprobante_pago} >
                                        <option value=""> </option>
                                        {
                                            comprobantePago.map((comprobante) => (
                                                cambiar.comprobante == comprobante.nombre_comprobante &&
                                                <option key={comprobante.id_comprobante_pago} value={comprobante.id_comprobante_pago}>
                                                    {comprobante.tipo_comprobante}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={8} sm={8}>
                                <FloatingLabel controlId="floatingInputGrid" label="N°">
                                    <Form.Control onChange={handleChange} name="numero_comprobante" type="number" value={cambiar.numero_comprobante} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Form.Group>

                    {showModal == true &&
                        <ValidacionMaterial mostrar={showModal} datos={datosValidacion} pago={formasPagos} comprobantes={comprobantePago} setShow={setShowModal} setSubmit={handleSubmit} />
                    }

                    <Button className="button-submit" variant="dark" type="submit">
                        Guardar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </>)
}

export default React.memo(ModRestante);