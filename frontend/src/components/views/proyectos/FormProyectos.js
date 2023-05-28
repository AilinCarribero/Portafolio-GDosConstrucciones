import React, { useState } from 'react';
import { Card, Button, Row, FloatingLabel, Form, Col } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import Decimal from 'decimal.js-light';

//Redux
import { useDispatch } from 'react-redux';
import { getProyectos } from '../../../redux/slice/Proyecto/thunks';

//Servicios
import { insertProyecto, setUpdateProyecto } from '../../../services/apiProyectos';

//Hooks
import { useGetCentroCosto } from '../../../hooks/useCentroCosto';
import { useGetUnidadNegocio } from '../../../hooks/useUnidadNegocio';
import { desformatNumber, formatFecha, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';

//Css
import './Proyectos.css';
import { useResponse } from '../../../hooks/useResponse';
import { useCliente } from '../../../hooks/useCliente';
import { postApiNewCliente } from '../../../services/apiClientes';

const FormProyectos = ({ close, updateProyecto, setUpdateProyectos }) => {
    const newDate = new Date();
    const año = newDate.getFullYear();
    const mes = newDate.getMonth();
    const dia = newDate.getDate();

    const dispatch = useDispatch();

    const [proyecto, setProyecto] = useState({
        id_centro_costo: updateProyecto ? updateProyecto.id_centro_costo : 2,
        id_unidad_negocio: updateProyecto ? updateProyecto.id_unidad_negocio : '',
        cliente: updateProyecto ? updateProyecto.cliente : '',
        id_cliente: updateProyecto ? updateProyecto.id_cliente : '',
        costo: updateProyecto ? updateProyecto.costo : '',
        venta: updateProyecto ? updateProyecto.venta : '',
        alquiler_total: updateProyecto ? updateProyecto.alquiler_total : 0,
        fecha_i_proyecto: updateProyecto ? new Date(updateProyecto.fecha_i_proyecto).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        fecha_f_proyecto: (updateProyecto && new Date(updateProyecto.fecha_f_proyecto).toISOString().slice(0, 10) != new Date('2200-01-01').toISOString().slice(0, 10)) ? new Date(updateProyecto.fecha_f_proyecto).toISOString().slice(0, 10) : '',
        id_estado: updateProyecto ? updateProyecto.id_estado : '1'
    });

    //Datos para usar en el formulario traidos de la api
    const { centroCosto } = useGetCentroCosto();
    const { unidadNegocio } = useGetUnidadNegocio();
    const { modulos, modulosDobles } = useGetModulos();
    const { clientes } = useCliente();

    const { response } = useResponse();

    //Eventos para mostrar partes del formulario
    const [showCostoVenta, setShowCostoVenta] = useState(updateProyecto && updateProyecto.id_centro_costo == 2 || proyecto.id_centro_costo === 2 ? true : false);
    const [showVenta, setShowVenta] = useState(updateProyecto && updateProyecto.id_centro_costo == 2 ? true : false);
    const [showAlquiler, setShowAlquiler] = useState(false);
    const [showDataAlquileres, setShowDataAlquileres] = useState(false);
    const [showNewCliente, setShowNewCliente] = useState(false);

    //Variables a usar
    const [checkCondicion, setCheckCondicion] = useState();
    const [dataAlquiler, setDataAlquiler] = useState([]);
    const [cantAlquiler, setCantAlquiler] = useState(0);

    //Variables de validacion
    const [validated, setValidated] = useState(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        //console.log(targetName + ' - ' + targetValue + ' - ' + targetCheck + ' - ' + e.target.type)

        if (targetCheck) {
            if (targetName == 'condicion') {
                setCheckCondicion(targetValue);

                setShowAlquiler(targetValue == 1 ? true : false);
                setShowVenta(targetValue == 0 ? true : false);
            }
        } else if (targetName == 'cantAlquiler') {
            setCantAlquiler(targetValue);
            setShowDataAlquileres(true);
        } else if (targetName.includes('fechaV') || targetName.includes('fechaI') || targetName.includes('id_modulo') || targetName.includes('monto') || targetName.includes('ubicacion')) {

            const positionArray = targetName.split('-')[1];

            if (targetName.includes('id_modulo') || dataAlquiler['id_modulo-' + positionArray]) {
                const moduloRev = modulos.find(modulo => modulo.id_modulo == targetValue || modulo.id_modulo == dataAlquiler['id_modulo-' + positionArray]);

                if (moduloRev.alquilers.length > 0) {
                    /*Revisar que la fecha de I no se encuentre entre alguna de las fechas de I y F de cada alquiler que posea el modulo */
                    /*Revisar que la fecha de F no se encuentre entre alguna de las fechas de I y F de cada alquiler que posea el modulo */
                    moduloRev.alquilers.map(alquiler => {

                        if (dataAlquiler['fechaI-' + positionArray] || targetName == `fechaI-${positionArray}`) {
                            const fechaI = new Date(targetName == `fechaI-${positionArray}` ? targetValue : dataAlquiler['fechaI-' + positionArray]);

                            if (new Date(alquiler.fecha_d_alquiler) <= fechaI && fechaI <= new Date(alquiler.fecha_h_alquiler)) {
                                ToastComponent('warn', 'El módulo ingresado en dicha fecha de inicio del contrato será utilizado en otro alquiler');
                            }
                        }

                        if (dataAlquiler['fechaV-' + positionArray] || targetName == `fechaV-${positionArray}`) {
                            const fechaV = new Date(targetName == `fechaV-${positionArray}` ? targetValue : dataAlquiler['fechaV-' + positionArray]);

                            if (new Date(alquiler.fecha_d_alquiler) <= fechaV && fechaV <= new Date(alquiler.fecha_h_alquiler)) {
                                ToastComponent('warn', 'El módulo ingresado en dicha fecha de finalización del contrato será utilizado en otro alquiler');
                            }
                        }
                    });
                }
            }

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
            let resProyecto = [];

            if (dataAlquiler && cantAlquiler > 0) {
                /*
                    Recorrer data alquiler y enviar uno por uno a la api para que se guarde en la tabla alquiler
                    Multiplicar el alquiler por el total de meses (mesfin - mesInicio) y sumar los resultados en caso de que haya mas de
                un alquiler. Esto sera el valor total por alquiler que se enviara a la api de proyectos para almacenarlo en la base de 
                datos.
                 */
                for (let i = 0; i < cantAlquiler; i++) {
                    const auxAlquilerFI = dataAlquiler['fechaI-' + i];
                    const auxAlquilerFV = dataAlquiler['fechaV-' + i];
                    const auxAlquilerIdM = dataAlquiler['id_modulo-' + i] || null;
                    const auxAlquilerIdMD = dataAlquiler['id_modulo_doble-' + i] || null;
                    const auxAlquilerUbicacion = dataAlquiler['ubicacion-' + i];
                    let auxAlquilerMonto = dataAlquiler['monto-' + i];

                    const mesFI = auxAlquilerFI.slice(5, 7);
                    const mesFV = auxAlquilerFV.slice(5, 7);
                    const cantMeses = mesFV - mesFI;

                    auxAlquilerMonto = desformatNumber(auxAlquilerMonto);
                    auxAlquilerMonto = new Decimal(auxAlquilerMonto);

                    auxAlquilerTotal = auxAlquilerMonto.add(auxAlquilerTotal).toNumber();

                    auxAlquileres[i] = {
                        id_modulo: auxAlquilerIdM,
                        id_modulo_doble: auxAlquilerIdMD,
                        valor: auxAlquilerMonto.toNumber(),
                        fecha_d_alquiler: auxAlquilerFI,
                        fecha_h_alquiler: auxAlquilerFV,
                        ubicacion: auxAlquilerUbicacion
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

            if (proyecto.cliente) {
                try {
                    const resCliente = await postApiNewCliente({nombre: proyecto.cliente});

                    const resResponse = response(resCliente);

                    if (resResponse) {
                        ToastComponent('success', 'El cliente fue guardado correctamente');
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            
            try {
                if (updateProyecto) {
                    try {
                        proyecto.id_proyecto = updateProyecto.id_proyecto;

                        resProyecto = await setUpdateProyecto(proyecto);
                    } catch (error) {
                        console.error(error);
                        ToastComponent('error');
                    }
                } else {
                    resProyecto = await insertProyecto(auxProyecto);
                }

                const res = response(resProyecto);

                if (res) {
                    ToastComponent('success');

                    //setUpdateProyectos(resProyecto.data);
                    dispatch(getProyectos());

                    setProyecto({
                        id_centro_costo: '',
                        id_unidad_negocio: '',
                        cliente: '',
                        id_cliente: '',
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
                    close();
                } else {
                    ToastComponent('error');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleNewCliente = (e) => {
        const targetCheck = e.target.checked;

        setShowNewCliente(targetCheck)
    }

    const dataAlquilerForm = () => {
        if (showDataAlquileres == true) {
            let rows = [];

            for (let i = 0; i < cantAlquiler; i++) {
                rows.push(
                    <Row key={`data-modulo-${i + 1}`}>
                        <Row>
                            <Col xs={12} sm={12}>
                                <FloatingLabel label="Módulo">
                                    <Form.Select onChange={handleChangeForm} name={"id_modulo" + '-' + i} >
                                        <option value=""> </option>
                                        {modulos.length > 0 ?
                                            modulos.map((modulo) => (
                                                modulo.estado === 0 && <option key={modulo.id_modulo} value={modulo.id_modulo}>
                                                    {
                                                        modulo.nombre_modulo ||
                                                        `${modulo.tipologia} - ${modulo.id_modulo} - ${formatNumber(modulo.ancho)} x ${formatNumber(modulo.largo)} - ${modulo.material_cerramiento}`
                                                    }
                                                </option>
                                            ))
                                            : <option>NO HAY MÓDULOS DISPONIBLES</option>
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12} sm={12}>
                                <FloatingLabel label="Módulo Doble">
                                    <Form.Select onChange={handleChangeForm} name={"id_modulo_doble" + '-' + i} >
                                        <option value=""> </option>
                                        {modulosDobles.length > 0 ?
                                            modulosDobles.map((moduloDoble) => (
                                                moduloDoble.vinculacion === true &&
                                                <option key={moduloDoble.id_modulo} value={moduloDoble.id_modulo_doble}>
                                                    {`OD - ${moduloDoble.id_modulo_doble} - OS - ${moduloDoble.id_modulo_uno} - OS - ${moduloDoble.id_modulo_dos} `}
                                                </option>
                                            ))
                                            : <option>NO HAY MÓDULOS DOBLES DISPONIBLES</option>
                                        }
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12}>
                                <FloatingLabel label="Monto del Alquiler">
                                    <NumericFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChangeForm} name={"monto-" + i} required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12}>
                                <FloatingLabel label="Ubicación">
                                    <Form.Control onChange={handleChangeForm} name={"ubicacion-" + i} type="text" required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6}>
                                <FloatingLabel label="Inicio">
                                    <Form.Control onChange={handleChangeForm} name={"fechaI-" + i} type="date" required />
                                </FloatingLabel>
                            </Col>
                            <Col xs={6} sm={6}>
                                <FloatingLabel label="Vencimiento">
                                    <Form.Control onChange={handleChangeForm} name={"fechaV-" + i} type="date" required />
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
                <Card className="text-center card-form mobile-form">
                    {!close && <Card.Header className="title-form" >Ingrese un Nuevo Proyecto</Card.Header>}
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmitForm} >
                            {updateProyecto ?
                                <Form.Group className="mb-3">
                                    <Form.Label className="label-title-proyecto">{updateProyecto.id_proyecto}</Form.Label>
                                </Form.Group>
                                :
                                <Form.Group className="mb-3" >
                                    <Form.Label className="label-title-proyecto">Nombre del Proyecto</Form.Label>
                                    <Row>
                                        <Col sm={12} >
                                            <FloatingLabel label="C.C.">
                                                <Form.Select onChange={handleChangeForm} name="id_centro_costo" value={proyecto.id_centro_costo} required disabled >
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
                                        <Col sm={12}>
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
                                        {!showNewCliente ?
                                            <Col sm={12}>
                                                <FloatingLabel label="Cliente Existente">
                                                    <Form.Select onChange={handleChangeForm} name="id_cliente" value={proyecto.id_cliente} required >
                                                        <option value="" > </option>
                                                        {clientes.length > 0 &&
                                                            clientes.map((cliente) => (
                                                                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                                                    {cliente.nombre}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            :
                                            <Col sm={12}>
                                                <FloatingLabel label="Nuevo Cliente">
                                                    <Form.Control onChange={handleChangeForm} name="cliente" type="text" value={proyecto.cliente} />
                                                </FloatingLabel>
                                            </Col>
                                        }
                                        <Col xs={12} sm={12} className='' >
                                            <Form.Check className='form-check-switch-new-cliente' onChange={handleNewCliente} label="Nuevo cliente" name="showNewCliente" type="switch" checked={showNewCliente} />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            }
                            {showCostoVenta && <>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Costo">
                                        <NumericFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                            onChange={handleChangeForm} name="costo" value={proyecto.costo} required />
                                    </FloatingLabel>
                                </Form.Group>
                                {!updateProyecto &&
                                    <Form.Group className="mb-3">
                                        <Row key={`inline-radio`} className="check">
                                            <Col xs={4} sm={4} >
                                                <Form.Check inline onChange={handleChangeForm} label="Venta" name="condicion" value="0" type="radio" checked={checkCondicion == '0'} />
                                            </Col>
                                            <Col xs={8} sm={8} >
                                                <Form.Check inline onChange={handleChangeForm} label="Alquiler" name="condicion" value="1" type="radio" checked={checkCondicion == '1'} />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                }
                                {showVenta &&
                                    <Form.Group className="mb-3">
                                        <FloatingLabel label="Venta">
                                            <NumericFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                                onChange={handleChangeForm} name="venta" value={proyecto.venta} required />
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

export default React.memo(FormProyectos);
