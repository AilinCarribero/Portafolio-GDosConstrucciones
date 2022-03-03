import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

//Servicios
import { insertProyecto } from '../../../services/apiProyectos';

//Hooks
import { useGetCentroCosto } from '../../../hooks/useCentroCosto';
import { useGetUnidadNegocio } from '../../../hooks/useUnidadNegocio';
import { ToastComponent } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';

//Css
import './Proyectos.css'

const FormProyectos = () => {
    const newDate = new Date();
    const año = newDate.getFullYear();
    const mes = newDate.getMonth();
    const dia = newDate.getDate();

    //Datos para usar en el formulario traidos de la api
    const { centroCosto } = useGetCentroCosto();
    const { unidadNegocio } = useGetUnidadNegocio();
    const { modulos } = useGetModulos();

    //Eventos para mostrar partes del formulario
    const [showCostoVenta, setShowCostoVenta] = useState(false);
    const [showVenta, setShowVenta] = useState(false);
    const [showAlquiler, setShowAlquiler] = useState(false);
    const [showDataAlquileres, setShowDataAlquileres] = useState(false);

    //Variables a usar
    const [checkCondicion, setCheckCondicion] = useState();
    const [dataAlquiler, setDataAlquiler] = useState([]);
    const [cantAlquiler, setCantAlquiler] = useState(0);

    //Variables de validacion
    const [validated, setValidated] = useState(false);

    const [proyecto, setProyecto] = useState({
        id_centro_costo: '',
        id_unidad_negocio: '',
        cliente: '',
        costo: '',
        venta: 0,
        alquiler_total: 0,
        fecha_i_proyecto: new Date().toISOString().slice(0, 10),
        fecha_f_proyecto: '',
        id_estado: '1'
    });

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        //console.log(targetName + ' - ' + targetValue + ' - ' + targetCheck)

        if (targetCheck) {
            if (targetName == 'condicion') {
                setCheckCondicion(targetValue);

                setShowAlquiler(targetValue == 1 ? true : false);
                setShowVenta(targetValue == 0 ? true : false);
            }
        } else if (targetName == 'cantAlquiler') {
            setCantAlquiler(targetValue);
            setShowDataAlquileres(true);
        } else if (targetName.includes('fechaV') || targetName.includes('fechaI') || targetName.includes('id_modulo') || targetName.includes('monto')) {
            setDataAlquiler(prevDataAlquiler => ({
                ...prevDataAlquiler,
                [targetName]: targetValue
            }))
        } else {
            setProyecto(prevProyecto => ({
                ...prevProyecto,
                [targetName]: targetValue
            }))
        }

        targetName == 'id_centro_costo' && setShowCostoVenta(targetValue == 2 ? true : false);
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        let auxAlquilerTotal = 0;
        let auxAlquileres = [];
        let auxProyecto = {};

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            if( dataAlquiler && cantAlquiler > 0 ){
                /*
                    Recorrer data alquiler y enviar uno por uno a la api para que se guarde en la tabla alquiler
                    Multiplicar el alquiler por el total de meses (mesfin - mesInicio) y sumar los resultados en caso de que haya mas de
                un alquiler. Esto sera el valor total por alquiler que se enviara a la api de proyectos para almacenarlo en la base de 
                datos.
                 */
                for(let i = 0; i < cantAlquiler ; i++){
                    const auxAlquilerFI = dataAlquiler['fechaI'+i];
                    const auxAlquilerFV = dataAlquiler['fechaV'+i];
                    const auxAlquilerIdM = dataAlquiler['id_modulo-'+i];
                    const auxAlquilerMonto = dataAlquiler['monto'+i];

                    const mesFI = auxAlquilerFI.slice(5,7);
                    const mesFV = auxAlquilerFV.slice(5,7);
                    const cantMeses = mesFV - mesFI;

                    auxAlquilerTotal = auxAlquilerTotal + (auxAlquilerMonto*cantMeses);

                    auxAlquileres[i] = {
                        id_modulo: auxAlquilerIdM,
                        valor: auxAlquilerMonto,
                        fecha_d_alquiler: auxAlquilerFI,
                        fecha_h_alquiler: auxAlquilerFV
                    }
                }

                auxProyecto = {
                    ...proyecto,
                    alquiler_total: auxAlquilerTotal,
                    alquileres: auxAlquileres
                }
            } else {
                auxProyecto = { ...proyecto }
            }

            try {
                const resProyecto = await insertProyecto(auxProyecto);

                if (resProyecto.data.todoOk == 'Ok' || resProyecto.statusText == 'OK' || resProyecto.status == 200) {
                    ToastComponent('success');

                    setProyecto({
                        id_centro_costo: '',
                        id_unidad_negocio: '',
                        cliente: '',
                        costo: '',
                        venta: '',
                        alquiler_total: '',
                        fecha_i_proyecto: new Date().toISOString().slice(0, 10),
                        fecha_f_proyecto: '',
                        id_estado: '1'
                    });
                    setValidated(false);
                    setCheckCondicion();
                    setDataAlquiler([]);
                    setCantAlquiler(0);
                    setShowCostoVenta(false);
                    setShowVenta(false);
                    setShowAlquiler(false);
                    setShowDataAlquileres(false);
                } else {
                    ToastComponent('error');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const dataAlquilerForm = () => {
        if (showDataAlquileres == true) {
            let rows = [];

            for (let i = 0; i < cantAlquiler; i++) {
                rows.push(
                    <Row key={i}>
                        <Row>
                            <Col xs={6} sm={6}>
                                <FloatingLabel label="Módulo">
                                    <Form.Select onChange={handleChangeForm} name={"id_modulo" + '-' + i} required >
                                        <option value=""> </option>
                                        {modulos.length > 0 ? 
                                            modulos.map((modulo) => (
                                                modulo.estado == 0 &&
                                                <option key={modulo.id_modulo} value={modulo.id_modulo}>
                                                    {modulo.nombre_modulo}
                                                </option>
                                            ))
                                            : <option>NO HAY MÓDULOS DISPONIBLES</option>
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={6} sm={6}>
                                <FloatingLabel label="Monto del Alquiler">
                                    <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChangeForm} name={"monto" + i} required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6}>
                                <FloatingLabel label="Inicio">
                                    <Form.Control onChange={handleChangeForm} name={"fechaI" + i} type="date" required />
                                </FloatingLabel>
                            </Col>
                            <Col xs={6} sm={6}>
                                <FloatingLabel label="Vencimiento">
                                    <Form.Control onChange={handleChangeForm} name={"fechaV" + i} type="date" required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Row>
                )
            }
            return rows
        }
    }

    return (<>
        <Row className="justify-content-center">
            <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" >
                <Card className="text-center card-form-proyectos mobile-form-proyecto">
                    <Card.Header className="title-form" >Ingrese un Nuevo Proyecto</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmitForm} >
                            <Form.Group className="mb-3" >
                                <Form.Label className="label-title-proyecto">Nombre del Proyecto</Form.Label>
                                <Row>
                                    <Col sm={6} >
                                        <FloatingLabel label="C.C.">
                                            <Form.Select onChange={handleChangeForm} name="id_centro_costo" value={proyecto.id_centro_costo} required >
                                                <option value=""> </option>
                                                {
                                                    centroCosto.map((centro_costo) => (
                                                        <option key={centro_costo.id_centro_costo} value={centro_costo.id_centro_costo}>
                                                            {centro_costo.tipo_centro_costo}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col sm={6}>
                                        <FloatingLabel label="U.N.">
                                            <Form.Select onChange={handleChangeForm} name="id_unidad_negocio" value={proyecto.id_unidad_negocio} required >
                                                <option value="" > </option>
                                                {
                                                    unidadNegocio.map((unidad_negocio) => (
                                                        <option key={unidad_negocio.id_unidad_negocio} value={unidad_negocio.id_unidad_negocio}>
                                                            {unidad_negocio.unidad_negocio}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <FloatingLabel label="Cliente">
                                            <Form.Control onChange={handleChangeForm} name="cliente" type="text" value={proyecto.cliente} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Form.Group>
                            {showCostoVenta && <>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Costo">
                                        <Form.Control onChange={handleChangeForm} name="costo" type="number" value={proyecto.costo} required />
                                    </FloatingLabel>
                                </Form.Group><Form.Group className="mb-3">
                                    <Row key={`inline-radio`} className="check">
                                        <Col xs={4} sm={4} >
                                            <Form.Check inline onChange={handleChangeForm} label="Venta" name="condicion" value="0" type="radio" checked={checkCondicion == '0'} />
                                        </Col>
                                        <Col xs={8} sm={8} >
                                            <Form.Check inline onChange={handleChangeForm} label="Alquiler" name="condicion" value="1" type="radio" checked={checkCondicion == '1'} />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                {showVenta &&
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Venta">
                                            <Form.Control onChange={handleChangeForm} name="venta" type="number" value={proyecto.venta} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                }
                                {showAlquiler &&
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Cantidad de Modulos a Alquilar">
                                            <Form.Control onChange={handleChangeForm} name="cantAlquiler" type="number" value={cantAlquiler} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                }
                                {showDataAlquileres &&
                                    <Form.Group className="mb-3">
                                        {dataAlquilerForm()}
                                    </Form.Group>
                                }
                            </>}
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha de Inicio del Proyecto">
                                    <Form.Control onChange={handleChangeForm} name="fecha_i_proyecto" type="date" value={proyecto.fecha_i_proyecto} required />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel controlId="floatingInputGrid" label="Fecha de Finalización del Proyecto">
                                    <Form.Control onChange={handleChangeForm} name="fecha_f_proyecto" type="date" value={proyecto.fecha_f_proyecto} />
                                </FloatingLabel>
                            </Form.Group>
                            <Button className="button-submit" variant="primary" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>)
}

export default React.memo(FormProyectos);
