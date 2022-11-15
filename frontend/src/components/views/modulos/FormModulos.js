import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';

//Components
import NumberFormat from 'react-number-format';

//Redux
import { useDispatch } from 'react-redux';
import { setShowModalQr } from '../../../redux/slice/QR/qrSlice';

//Servicios
import { insertModulos, setUpdate } from '../../../services/apiModulos';

//Hooks
import { desformatNumber, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useResponse } from '../../../hooks/useResponse';

//Css
import '../../../style/Modulos.scss';

//Img
import * as Icons from 'react-bootstrap-icons';

const FormModulos = ({ close, updateModulo, setUpdateModulo }) => {
    const dispatch = useDispatch();
    const { response } = useResponse();

    const newDate = new Date();
    const año = newDate.getFullYear();
    const mes = newDate.getMonth();
    const dia = newDate.getDate();

    const [validated, setValidated] = useState(false);

    const [modulo, setModulo] = useState({
        nombre_modulo: updateModulo.nombre_modulo ? updateModulo.nombre_modulo : '',
        costo: updateModulo.costo ? updateModulo.costo : '',
        venta: updateModulo.venta ? updateModulo.venta : '',
        fecha_creacion: updateModulo.fecha_creacion ? new Date(updateModulo.fecha_creacion).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        fecha_venta: updateModulo.fecha_venta ? new Date(updateModulo.fecha_venta).toISOString().slice(0, 10) : '',
        estado: updateModulo.estado ? updateModulo.estado : '',
        descripcion: updateModulo.descripcion ? updateModulo.descripcion : '',
        tipologia: updateModulo.tipologia ? updateModulo.tipologia : '',
        ancho: updateModulo.ancho ? updateModulo.ancho : '',
        largo: updateModulo.largo ? updateModulo.largo : '',
        material_cerramiento: updateModulo.material_cerramiento ? updateModulo.material_cerramiento : '',
        col_exterior: updateModulo.col_exterior ? updateModulo.col_exterior : '',
        col_interior: updateModulo.col_interior ? updateModulo.col_interior : '',
        vent_alto: updateModulo.vent_alto ? updateModulo.vent_alto.split('-') : '',
        vent_ancho: updateModulo.vent_ancho ? updateModulo.vent_ancho.split('-') : '',
        material_piso: updateModulo.material_piso ? updateModulo.material_piso : '',
        puertas: updateModulo.puertas ? updateModulo.puertas : '',
        ventanas: updateModulo.ventanas ? updateModulo.ventanas : '',
        equipamiento: updateModulo.equipamiento ? updateModulo.equipamiento.split(',') : '',
        inst_electrica: updateModulo.inst_electrica ? updateModulo.inst_electrica : false,
        inst_sanitaria: updateModulo.inst_sanitaria ? updateModulo.inst_sanitaria : false,
        inst_especiales: updateModulo.inst_especiales ? updateModulo.inst_especiales : false,
        cliente: updateModulo.cliente ? updateModulo.cliente : ''
    });

    const [countEquipamiento, setCountEquipamiento] = useState(updateModulo.equipamiento ? updateModulo.equipamiento.split(',').length : 1);
    const [countDimensionesVentanas, setCountDimensionesVentanas] = useState(updateModulo.vent_alto ? updateModulo.vent_alto.split('-').length : 1);

    const [checkVenta, setCheckVenta] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;
        const targetType = e.target.type;

        if (targetName.includes("equipamiento")) {
            const nameSplit = targetName.split('-');

            if (modulo.equipamiento[nameSplit[1]]) {
                const newArray = modulo.equipamiento.map((value, index) => {
                    if (index == nameSplit[1]) {
                        return targetValue
                    } else {
                        return value
                    }
                })

                setModulo(prevModulo => ({
                    ...prevModulo,
                    [nameSplit[0]]: newArray
                }));
            } else {
                const array = modulo.equipamiento ? modulo.equipamiento.concat([targetValue]) : [targetValue];

                setModulo(prevModulo => ({
                    ...prevModulo,
                    [nameSplit[0]]: array
                }));
            }

        } else if (targetName.includes("vent_alto") || targetName.includes("vent_ancho")) {
            const nameSplit = targetName.split('-');

            if (modulo[nameSplit[0]][nameSplit[1]]) {
                const newArray = modulo[nameSplit[0]].map((value, index) => {
                    if (index == nameSplit[1]) {
                        return targetValue
                    } else {
                        return value
                    }
                })

                setModulo(prevModulo => ({
                    ...prevModulo,
                    [nameSplit[0]]: newArray
                }));
            } else {
                const array = modulo[nameSplit[0]] ? modulo[nameSplit[0]].concat([targetValue]) : [targetValue];

                setModulo(prevModulo => ({
                    ...prevModulo,
                    [nameSplit[0]]: array
                }));
            }
        } else {
            if (targetType === "checkbox") {
                setModulo(prevModulo => ({
                    ...prevModulo,
                    [targetName]: targetCheck
                }));
            } else {
                setModulo(prevModulo => ({
                    ...prevModulo,
                    [targetName]: targetValue
                }));
            }
        }
    }

    const handleChangeCheckVenta = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;
        const targetType = e.target.type;

        console.log(targetName, targetValue, targetCheck, targetType)

        setCheckVenta(targetCheck);

    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        let auxModulo = {};

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            auxModulo = {
                ...modulo,
                costo: desformatNumber(modulo.costo),
                venta: desformatNumber(modulo.venta),
                ancho: desformatNumber(modulo.ancho),
                largo: desformatNumber(modulo.largo),
                vent_alto: modulo.vent_alto.map(vent_alto => desformatNumber(vent_alto)),
                vent_ancho: modulo.vent_ancho.map(vent_ancho => desformatNumber(vent_ancho)),
            }

            try {
                let resModulo = [];

                if (updateModulo && updateModulo.id_modulo) {
                    resModulo = await setUpdate(auxModulo, updateModulo.id_modulo);
                } else {
                    resModulo = await insertModulos(auxModulo);
                }

                const res = response(resModulo);

                if (res) {
                    ToastComponent('success');

                    setUpdateModulo(resModulo.data.data);

                    //const infoQR = resModulo.data.data.find( modulo => )

                    setModulo({
                        nombre_modulo: '',
                        costo: '',
                        venta: '',
                        fecha_creacion: new Date().toISOString().slice(0, 10),
                        fecha_venta: '',
                        estado: '',
                        descripcion: '',
                        tipologia: '',
                        ancho: '',
                        largo: '',
                        material_cerramiento: '',
                        col_exterior: '',
                        col_interior: '',
                        vent_alto: '',
                        vent_ancho: '',
                        material_piso: '',
                        puertas: '',
                        ventanas: '',
                        equipamiento: '',
                        inst_electrica: false,
                        inst_sanitaria: false,
                        inst_especiales: false,
                        cliente: ''
                    });
                    setValidated(false);
                    dispatch(setShowModalQr({
                        url: resModulo.data.url_qr,
                        show: updateModulo && updateModulo.id_modulo ? false : true
                    }));
                    close();
                } else {
                    ToastComponent('error', resModulo.data.todoMal && resModulo.data.todoMal);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const restValueEquipamiento = () => {
        setCountEquipamiento(countEquipamiento - 1);

        const newArray = modulo.equipamiento;

        if (newArray.length > 1) {
            newArray.pop();
        }

        setModulo(prevModulo => ({
            ...prevModulo,
            "equipamiento": newArray
        }));
    }

    const restDimensionesVentanas = () => {
        setCountDimensionesVentanas(countDimensionesVentanas - 1);

        const newArrayVentAlto = modulo.vent_alto;
        const newArrayVentAncho = modulo.vent_ancho;

        if (newArrayVentAlto.length > 1) {
            newArrayVentAlto.pop();
        }

        if (newArrayVentAncho.length > 1) {
            newArrayVentAncho.pop();
        }

        setModulo(prevModulo => ({
            ...prevModulo,
            "vent_alto": newArrayVentAlto,
            "vent_ancho": newArrayVentAncho
        }));
    }

    const renderSelectEquipamiento = () => {
        const rows = [];
        for (let i = 0; i < countEquipamiento; i++) {
            rows.push(
                <Col key={i} sm={11}>
                    <FloatingLabel label="Equipamiento" >
                        <Form.Select onChange={handleChangeForm} name={`equipamiento-${i}`} value={modulo.equipamiento[i]}>
                            <option value=""></option>
                            <option value="Termo Mecánico">Termo Mecánico</option>
                            <option value="Mobiliario">Mobiliario</option>
                            <option value="Sanitario">Sanitario</option>
                            <option value="Cocina">Cocina</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            );
            if (i === 0 && countEquipamiento > 1) {
                rows.push(<Col key={countEquipamiento} sm={1} id='button-sum-equipamiento' ><Icons.DashSquareFill id="icon" size={30} onClick={() => restValueEquipamiento()} /></Col>)
            }
        }
        return rows;
    }

    const renderDimensionesVentana = () => {
        const rows = [];
        for (let i = 0; i < countDimensionesVentanas; i++) {
            rows.push(
                <Col key={`vent_alto-${i}`} sm={5}>
                    <Form.Group className="mb-3">
                        <FloatingLabel label="Dimensión-Alto">
                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                onChange={handleChangeForm} name={`vent_alto-${i}`} value={modulo.vent_alto[i]} />
                        </FloatingLabel>
                    </Form.Group>
                </Col>
            )
            rows.push(
                <Col key={`vent_ancho-${i}`} sm={5}>
                    <Form.Group className="mb-3">
                        <FloatingLabel label="Dimensión-Ancho">
                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                onChange={handleChangeForm} name={`vent_ancho-${i}`} value={modulo.vent_ancho[i]} />
                        </FloatingLabel>
                    </Form.Group>
                </Col>
            )
            if (i === 0 && countDimensionesVentanas > 1) {
                rows.push(<Col key={countDimensionesVentanas} sm={1} id='button-sum' ><Icons.DashSquareFill id="icon" size={30} onClick={() => restDimensionesVentanas()} /></Col>)
            }
        }

        return rows;
    }

    return (<>
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form mobile-form">
                    {!close && <Card.Header className="title-form" >Ingrese un Nuevo Modulo</Card.Header>}
                    <Card.Body className='container-form-modulo'>
                        <Form noValidate validated={validated} onSubmit={handleSubmitForm} >
                            <Form.Group className="mb-3" >
                                <Row>
                                    <p>Módulo<b> {`${modulo.tipologia ? modulo.tipologia : 'tipologia'} - ${modulo.ancho ? modulo.ancho : 'ancho'} x ${modulo.largo ? modulo.largo : 'largo'} - ${modulo.material_cerramiento ? modulo.material_cerramiento : 'Material de Cerramiento'} - ${updateModulo.id_modulo ? updateModulo.id_modulo : 'id'}`}</b> </p>
                                </Row>
                            </Form.Group>
                            <Row>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Costo">
                                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="costo" value={modulo.costo} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Check inline onChange={handleChangeCheckVenta} label="Venta" name="checkVenta" type="checkbox" checked={checkVenta} />
                                </Col>
                                {checkVenta && <>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Valor de Venta">
                                                <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                    onChange={handleChangeForm} name="venta" value={modulo.venta} />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <FloatingLabel label="Cliente">
                                                <Form.Control onChange={handleChangeForm} name="cliente" value={modulo.cliente} />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                </>}
                            </Row>
                            <Row className='title-caracteristicas'> <p>Caracteristicas</p> </Row>
                            <Row className='content-select'>
                                <Col sm={12}>
                                    <FloatingLabel label="Tipologia" >
                                        <Form.Select onChange={handleChangeForm} name="tipologia" value={modulo.tipologia}>
                                            <option value=""></option>
                                            <option value="OS">Oficina Simple</option>
                                            <option value="OD">Oficina Doble</option>
                                            <option value="MA">Módulo Apareado</option>
                                            <option value="E">Especial</option>
                                            <option value="BM">Base Maritima</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row className='content-select'>
                                <Col sm={12}>
                                    <FloatingLabel label="Material de Cerramiento" >
                                        <Form.Select onChange={handleChangeForm} name="material_cerramiento" value={modulo.material_cerramiento}>
                                            <option value=""></option>
                                            <option value="PUR">{'PUR (Poliuretano)'}</option>
                                            <option value="EPS">{'EPS (Poliestireno)'}</option>
                                            <option value="Otro">Otro</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row className='content-select'>
                                <Col sm={12}>
                                    <FloatingLabel label="Material del Piso" >
                                        <Form.Select onChange={handleChangeForm} name="material_piso" value={modulo.material_piso}>
                                            <option value=""></option>
                                            <option value="Multilaminado">Multilaminado</option>
                                            <option value="Goma">Goma</option>
                                            <option value="Flotante">Flotante</option>
                                            <option value="Otros">Otros</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row className='content-select'>
                                {renderSelectEquipamiento()}
                                <Col sm={1} id='button-sum-equipamiento' ><Icons.PlusSquareFill id="icon" size={30} onClick={() => setCountEquipamiento(countEquipamiento + 1)} /></Col>
                            </Row>
                            <Row>
                                <Col sm={12} className="title-section">Dimensiones</Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Ancho">
                                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="ancho" value={modulo.ancho} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Largo">
                                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="largo" value={modulo.largo} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} className="title-section">Color</Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Exterior">
                                            <Form.Control onChange={handleChangeForm} name="col_exterior" value={modulo.col_exterior} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Interior">
                                            <Form.Control onChange={handleChangeForm} name="col_interior" value={modulo.col_interior} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} className="title-section">Carpinterias</Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="UN Puertas">
                                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="puertas" value={modulo.puertas} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="UN Ventanas">
                                            <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="ventanas" value={modulo.ventanas} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                {renderDimensionesVentana()}
                                <Col sm={1} id='button-sum' ><Icons.PlusSquareFill id="icon" size={30} onClick={() => setCountDimensionesVentanas(countDimensionesVentanas + 1)} /></Col>
                            </Row>
                            <Row className='content-checks'>
                                <Col sm={12}>
                                    <Form.Check inline onChange={handleChangeForm} label="Instalación Eléctrica" name="inst_electrica" type="checkbox" checked={modulo.inst_electrica} />
                                </Col>
                                <Col sm={12}>
                                    <Form.Check inline onChange={handleChangeForm} label="Instalación Sanitaria" name="inst_sanitaria" type="checkbox" checked={modulo.inst_sanitaria} />
                                </Col>
                                <Col sm={12}>
                                    <Form.Check inline onChange={handleChangeForm} label="Instalaciones Especiales" name="inst_especiales" type="checkbox" checked={modulo.inst_especiales} />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Descripción">
                                            <Form.Control as="textarea" row={3} onChange={handleChangeForm} name="descripcion" type="text" value={modulo.descripcion} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/*<FloatingLabel label="Estado en el que se encuentra el modulo">
                                <Form.Select onChange={handleChangeForm} name="estado" value={modulo.estado} >
                                    <option value="Libre"> Libre </option>
                                    <option value="En Alquiler"> En Alquiler </option>
                                    <option value="Vendido"> Vendido </option>
                                </Form.Select>
                            </FloatingLabel>*/}
                            <Button className="button-submit" variant="dark" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>)
}

export default React.memo(FormModulos);