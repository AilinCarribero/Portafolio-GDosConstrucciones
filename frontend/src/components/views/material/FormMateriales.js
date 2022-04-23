import React, { useState } from "react";
import { Card, Col, Row, Form, FloatingLabel, Button } from "react-bootstrap";

//Component
import NumberFormat from 'react-number-format';
import ValidacionMaterial from "../../utils/modal/validacion/ValidacionMaterial";

//Hooks
import { useUser } from "../../../hooks/useUser";
import { formatNumber, ToastComponent, desformatNumber } from "../../../hooks/useUtils";
import { useGetComprobantesPago } from "../../../hooks/useComprobantePago";
import { useGetFormasPagos } from "../../../hooks/useFormasPagos";
import { useGetProyectos } from "../../../hooks/useProyectos";

//Services
import { insertStock } from "../../../services/apiStock";

//Css
import "./Materiales.css";

const FormMateriales = ({ close, setStock }) => {
    const { user } = useUser();
    const { formasPagos } = useGetFormasPagos();
    const { proyectos } = useGetProyectos();
    const { comprobantePago } = useGetComprobantesPago();

    /*Declaracion de variables de fecha*/
    const newDate = new Date();
    const año = newDate.getFullYear();
    const dia = newDate.getDate();
    const proyectosCC = proyectos ? proyectos.filter((proyecto) => proyecto.id_proyecto.includes("CCC") || proyecto.id_proyecto.includes("CCE")) : [];

    const [newMaterial, setNewMaterial] = useState({
        nombre_stock: '',
        valor_unidad: 0,
        cantidad: 0,
        medida: 'unidad',
        restante_valor: 0,
        salida: new Date().toISOString().slice(0, 10),
        id_user: user.id,
        id_forma_pago: '',
        fecha_pago: new Date().toISOString().slice(0, 10),
        valor_pago: 0,
        id_forma_pago: '',
        fecha_diferido_pago: '',
        observaciones: '',
        id_comprobante_pago: '',
        numero_comprobante: '',
        proyecto: ''
    });

    //Variables con informacion
    const [cantCheque, setCantCheque] = useState(0);
    const [cheques, setCheques] = useState();

    //Envio para modal de validacion
    const [datosValidacion, setDatosValidacion] = useState([]);
    const [auxNewMaterials, setAuxNewMaterials] = useState([]);

    //Eventos para mostrar partes del formulario
    const [showCuotas, setShowCuotas] = useState(false);
    const [showFechaDif, setShowFechaDif] = useState(false);
    const [showCheque, setShowCheque] = useState(false);
    const [showDataCheques, setShowDataCheques] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //Checks
    const [checkComprobante, setCheckComprobante] = useState();

    //Variables para validacion
    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        let auxValorPago = 0;

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
            setNewMaterial(prevNewMaterial => ({
                ...prevNewMaterial,
                [targetName]: targetValue
            }))
        } else if (targetName == "valor_unidad" || targetName == "cantidad") {
            const auxNumero = desformatNumber(targetValue);

            /* Si lo que se esta ingresando es un valor de unidad entonces se debe multiplicar por la cantidad que esta guardado, 
            en caso de que se este ingresando la cantidad entonces el valor unitario que esta guardado debe multiplicarse por la 
            cantidad que se esta ingresando */
            auxValorPago = targetName == "valor_unidad" ? auxNumero * newMaterial.cantidad : newMaterial.valor_unidad * auxNumero;

            setNewMaterial(prevNewMaterial => ({
                ...prevNewMaterial,
                [targetName]: auxNumero,
                valor_pago: auxValorPago
            }))
        } else {
            setNewMaterial(prevNewMaterial => ({
                ...prevNewMaterial,
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
        const auxNewMaterial = [];

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            /*En caso de tener cuotas el valor del importe debe dividirse en partes iguales acorde a la cantidad de cuotas 
            seleccionadas y se debera diferir cada cuota a 30 dias despues de la siguiente */
            if (newMaterial.cuota > 0) {
                const valorCuota = newMaterial.valor_pago ? (newMaterial.valor_pago / newMaterial.cuota) : 0;

                if (valorCuota !== 0) {
                    for (let i = 0; i < newMaterial.cuota; i++) {
                        const mesD = newDate.getMonth() + i + 1;

                        auxNewMaterial[i] = {
                            ...newMaterial,
                            cuotaNumero: i,
                            restante_valor: newMaterial.valor_pago,
                            valor: newMaterial.valor_pago,
                            valor_pago: valorCuota,
                            fecha_diferido_pago: new Date(año, mesD, dia).toISOString().slice(0, 10),
                        }
                    }
                }
                setAuxNewMaterials(auxNewMaterial);
                setDatosValidacion(auxNewMaterial);
                setShowModal(true);
            } else if (cheques && cantCheque > 0) {
                /*Si existen cheques entonces guardar en una variable aux los datos de ingreso + los datos del cheque*/
                for (let i = 0; i < cantCheque; i++) {
                    const auxChequeFD = cheques['fechaD' + i];
                    const auxChequeM = desformatNumber(cheques['monto' + i]);

                    auxNewMaterial[i] = {
                        ...newMaterial,
                        valor_pago: auxChequeM,
                        restante_valor: newMaterial.valor_pago,
                        valor: newMaterial.valor_pago,
                        fecha_diferido_pago: auxChequeFD,
                        cheque: i,
                    }
                }
                setAuxNewMaterials(auxNewMaterial);
                setDatosValidacion(auxNewMaterial);
                setShowModal(true);
            } else {
                //Si no hay cuotas el proceso de guardado es normal
                const material = {
                    ...newMaterial,
                    restante_valor: newMaterial.valor_pago,
                    valor: newMaterial.valor_pago,
                }

                setDatosValidacion(material);
                setAuxNewMaterials(material);
                setShowModal(true);
            }
        }
    }

    const handleSubmit = async () => {
        let resNewMaterial = [];

        if (auxNewMaterials.length > 0) {
            try {
                resNewMaterial = await insertStock(auxNewMaterials);
            } catch (error) {
                console.log(error);
                ToastComponent('error');
            }
        } else {
            try {
                if (!newMaterial.id_comprobante_pago) {
                    newMaterial.id_comprobante_pago = 6;
                }
                resNewMaterial = await insertStock(auxNewMaterials);
            } catch (error) {
                console.log(error);
                ToastComponent('error');
            }
        }

        if ((resNewMaterial.data.todoOk == 'Ok' || resNewMaterial.statusText == 'OK' || resNewMaterial.status == 200) && !resNewMaterial.data.todoMal) {
            ToastComponent('success');

            //En caso de tener algun elemento extra mostrandose se vuelve a ocular
            showCuotas && setShowCuotas(false);
            showFechaDif && setShowFechaDif(false);
            showDataCheques && setShowDataCheques(false);

            setStock(resNewMaterial.data);

            //Los campos se vacian 
            setNewMaterial({
                nombre_stock: '',
                valor_unidad: 0,
                cantidad: 0,
                medida: 'unidad',
                restante_valor: 0,
                salida: new Date().toISOString().slice(0, 10),
                id_user: user.id,
                id_forma_pago: '',
                fecha_pago: new Date().toISOString().slice(0, 10),
                valor_pago: 0,
                id_forma_pago: '',
                fecha_diferido_pago: '',
                observaciones: '',
                id_comprobante_pago: '',
                numero_comprobante: '',
                proyecto: '',
            })

            setValidated(false);
            close();
        } else {
            if (resNewMaterial.data.todoMal) {
                ToastComponent('error', resNewMaterial.data.todoMal);
            } else {
                ToastComponent('error');
            }
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
                                <Form.Control onChange={handleChangeForm} name={"fechaD" + i} type="date" required />
                            </FloatingLabel>
                        </Col>
                        <Col xs={6} sm={6}>
                            <FloatingLabel controlId="floatingInputGrid" label="Monto del Cheque">
                                <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                    onChange={handleChangeForm} name={"monto" + i} required />
                            </FloatingLabel>
                        </Col>
                    </Row>
                )
            }
            return rows
        }
    }

    return (<>
        <Col className="form-center">
            <Card>
                <Card.Header className="title-form"> Material </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleValidacion} >
                        <Form.Group className="mb-3" >
                            <FloatingLabel label="Centro de Costo">
                                <Form.Select onChange={handleChangeForm} name="proyecto" value={newMaterial.proyecto} required >
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
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Nombre/Identificador" className="mb-3">
                                <Form.Control onChange={handleChangeForm} name="nombre_stock" type="text" value={newMaterial.nombre_stock} required />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Valor Unitario" className="mb-3">
                                <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                    onChange={handleChangeForm} name="valor_unidad" value={newMaterial.valor_unidad} required />
                            </FloatingLabel>
                        </Form.Group>
                        <Row>
                            <Col xs={6} sm={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInput" label="Cantidad" className="mb-3">
                                        <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                            onChange={handleChangeForm} name={"cantidad"} value={newMaterial.cantidad} required />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6}>
                                <Form.Group className="mb-3" >
                                    <FloatingLabel label="Unidad de Medida">
                                        <Form.Select onChange={handleChangeForm} name="medida" value={newMaterial.medida} required>
                                            <option value="unidad">Unidad</option>
                                            <option value="m2">m2</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} className="text-total">
                                <Form.Text>
                                    Valor Unitario (${formatNumber(newMaterial.valor_unidad)}) x Cantidad ({formatNumber(newMaterial.cantidad)}) = ${formatNumber(newMaterial.valor_pago)}
                                </Form.Text>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" >
                            <FloatingLabel label="Forma en que se realizo el pago">
                                <Form.Select onChange={handleChangeForm} name="id_forma_pago" value={newMaterial.id_forma_pago} required>
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
                                <Form.Control onChange={handleChangeForm} name="fecha_pago" type="date" value={newMaterial.fecha_pago} required />
                            </FloatingLabel>
                        </Form.Group>
                        {showCuotas && <>
                            <Form.Group className="mb-3" >
                                <FloatingLabel label="Cantidad de cuotas">
                                    <Form.Select onChange={handleChangeForm} name="cuota">
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
                                {newMaterial.cuota &&
                                    <Form.Text className="text-small">
                                        Cuotas de ${formatNumber(newMaterial.valor_pago / newMaterial.cuota)} c/u
                                    </Form.Text>
                                }
                            </Form.Group>
                        </>}
                        {showCheque &&
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Cantidad de Cheques">
                                    <Form.Control onChange={handleChangeForm} name="cantCheque" type="number" value={cantCheque} required />
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
                                    <Form.Control onChange={handleChangeForm} name="fecha_diferido_pago" type="date" value={newMaterial.fecha_diferido_pago} required />
                                </FloatingLabel>
                            </Form.Group>
                        }
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInputGrid" label="Detalle">
                                <Form.Control onChange={handleChangeForm} name="observaciones" type="text" value={newMaterial.observaciones} />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="label-title">Comprobante de Pago</Form.Label>
                            <Row key={`inline-radio`} className="check">
                                <Col xs={4} sm={4} >
                                    <Form.Check inline onChange={handleChangeForm} label="Factura" name="comprobante" value="Factura" type="radio" checked={checkComprobante == 'Factura'} />
                                </Col>
                                <Col xs={8} sm={8} >
                                    <Form.Check inline onChange={handleChangeForm} label="Comprobante de Pago" name="comprobante" value="Comprobante de Pago" type="radio" checked={checkComprobante == 'Comprobante de Pago'} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4} sm={4}>
                                    <FloatingLabel label="Tipo">
                                        <Form.Select onChange={handleChangeForm} name="id_comprobante_pago" value={newMaterial.id_comprobante_pago} >
                                            <option value=""> </option>
                                            {
                                                comprobantePago.map((comprobante) => (
                                                    newMaterial.comprobante == comprobante.nombre_comprobante &&
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
                                        <Form.Control onChange={handleChangeForm} name="numero_comprobante" type="number" value={newMaterial.numero_comprobante} />
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
                </Card.Body>
            </Card>
        </Col>
    </>)
}

export default React.memo(FormMateriales);