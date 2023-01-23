import React, { useState, useEffect } from 'react'
import { Button, Form, Modal, Row, FloatingLabel, Col } from 'react-bootstrap'
import { NumericFormat } from 'react-number-format';
import Decimal from 'decimal.js-light';
import { useParams } from 'react-router-dom';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getProyectos } from '../../../redux/slice/Proyecto/thunks';

//Componets
import ValidacionNewContrato from '../../utils/modal/validacion/ValidacionNewContrato';

//Hooks
import { calcDifMeses, desformatNumber, formatFechaISO, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';
import { useResponse } from '../../../hooks/useResponse';

//Service
import { postNewRenovarUpdateContrato } from '../../../services/apiAlquileres';

const FormContrato = ({ alquiler, show, setShow, setAlquileres, actionContrato, idProyecto }) => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const { modulos, modulosDobles } = useGetModulos();
    const { response } = useResponse();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const proyecto = proyectos.find(proyecto => proyecto.id_proyecto === id || proyecto.id_proyecto === idProyecto );

    const [newContrato, setNewContrato] = useState({
        id_alquiler: alquiler ? alquiler.id_alquiler : '',
        id_modulo: alquiler ? alquiler.id_modulo : '',
        id_modulo_doble: alquiler ? alquiler.id_modulo_doble : '',
        alquiler: alquiler ? alquiler : '',
        proyecto: proyecto,
        nombre_modulo: alquiler ? (alquiler.modulo ? alquiler.modulo.nombre_modulo || `${alquiler.modulo.tipologia} - ${alquiler.modulo.id_modulo} - ${formatNumber(alquiler.modulo.ancho)} x ${formatNumber(alquiler.modulo.largo)} - ${alquiler.modulo.material_cerramiento}` : `OD - ${alquiler.modulo_doble.id_modulo_doble} - OS - ${alquiler.modulo_doble.id_modulo_uno} - OS - ${alquiler.modulo_doble.id_modulo_dos} `) : '',
        id_proyecto: id || idProyecto,
        alquiler_total: proyecto.alquiler_total,
        fecha_d_alquiler: alquiler ? formatFechaISO(alquiler.fecha_d_alquiler) : formatFechaISO(new Date()),
        fecha_h_alquiler: alquiler ? formatFechaISO(alquiler.fecha_h_alquiler) : '',
        valor: actionContrato == "Modificar" ? alquiler.valor : '',
        ubicacion: alquiler ? alquiler.modulo.ubicacion : ''
    });

    useEffect(() => {
        if (proyecto) {
            //console.log(proyecto)
        }

        return () => { }
    }, [proyecto])

    //Variables para validacion
    const [validated, setValidated] = useState(false);
    const [showModalValidation, setShowModalValidation] = useState(false);

    const handleClose = () => setShow(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        //console.log("tn: ", targetName, " tv: ", targetValue, " tc: ", targetCheck);
        if (targetName === "id_modulo") {
            setNewContrato(prevNewContrato => ({
                ...prevNewContrato,
                id_modulo_doble: ''
            }))
        }

        if (targetName === "id_modulo_doble") {
            setNewContrato(prevNewContrato => ({
                ...prevNewContrato,
                id_modulo: ''
            }))
        }

        setNewContrato(prevNewContrato => ({
            ...prevNewContrato,
            [targetName]: targetValue
        }))
    }

    const handleValidacion = (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            ToastComponent('warn');
            e.stopPropagation();
        }
        setValidated(true);

        //Si todos los campos son correcto pasamos a setear los campos para verificarlos
        if (form.checkValidity() === true) {

            setNewContrato(prevNewContrato => ({
                ...prevNewContrato,
                alquiler_total: new Decimal(newContrato.alquiler_total).add(newContrato.valor ? desformatNumber(newContrato.valor) : 0).toNumber(),
                valor: desformatNumber(newContrato.valor),
                action: actionContrato
            }))

            setShowModalValidation(true);
        }
    }

    const handleSubmit = async () => {
        let resNewContrato = [];

        try {
            resNewContrato = await postNewRenovarUpdateContrato(newContrato);

            const res = response(resNewContrato);

            if (res) {
                ToastComponent('success');

                setNewContrato({
                    id_alquiler: '',
                    id_modulo: '',
                    id_modulo_doble: '',
                    alquiler: '',
                    nombre_modulo: '',
                    id_proyecto: '',
                    alquiler_total: '',
                    fecha_d_alquiler: '',
                    fecha_h_alquiler: '',
                    valor: '',
                })

                dispatch(getProyectos());
                setShow(false);

                setAlquileres(resNewContrato.data);
            } else {
                ToastComponent('error', resNewContrato.data.todoMal && resNewContrato.data.todoMal);
            }
        } catch (error) {
            console.error(error);
            ToastComponent('error');
        }
    }

    const findModuloAlquiler = (idModulo) => {
        const moduloFind = proyecto.alquilers.find(moduloAlquiler => idModulo == moduloAlquiler.id_modulo);

        if (moduloFind) {
            const modulo = moduloFind.modulo;

            return (
                <option key={idModulo} value={idModulo}>
                    {modulo.nombre_modulo || `${modulo.tipologia} - ${formatNumber(modulo.ancho)} x ${formatNumber(modulo.largo)} - ${modulo.material_cerramiento} - ${idModulo}`}
                </option>
            )
        }
    }

    return (
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header className="content-modal-header" closeButton><b>{actionContrato} Contrato del módulo {newContrato.nombre_modulo}</b></Modal.Header>
            <Modal.Body className="content-modal-body">
                <Row>
                    <Form noValidate validated={validated} onSubmit={handleValidacion}>
                        {actionContrato !== 'Renovar' &&
                            <Row>
                                <Col xs={12} sm={12}>
                                    <FloatingLabel label="Módulo">
                                        <Form.Select onChange={handleChangeForm} name="id_modulo" value={newContrato.id_modulo}>
                                            <option value=""> </option>
                                            {modulos.length > 0 ?
                                                modulos.map((modulo) => (
                                                    modulo.estado === 0 ?
                                                        <option key={modulo.id_modulo} value={modulo.id_modulo}>
                                                            {modulo.nombre_modulo || `${modulo.tipologia} - ${formatNumber(modulo.ancho)} x ${formatNumber(modulo.largo)} - ${modulo.material_cerramiento} - ${modulo.id_modulo}`}
                                                        </option>
                                                        :
                                                        findModuloAlquiler(modulo.id_modulo)
                                                ))
                                                : <option>NO HAY MÓDULOS DISPONIBLES</option>
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12} sm={12}>
                                    <FloatingLabel label="Módulo Doble">
                                        <Form.Select onChange={handleChangeForm} name="id_modulo_doble" value={newContrato.id_modulo_doble} >
                                            <option value=""> </option>
                                            {modulosDobles.length > 0 ?
                                                modulosDobles.map((moduloDoble) => (
                                                    moduloDoble.vinculacion === true &&
                                                    <option key={moduloDoble.id_modulo_doble} value={moduloDoble.id_modulo_doble}>
                                                        {`OD - ${moduloDoble.id_modulo_doble} - OS - ${moduloDoble.id_modulo_uno} - OS - ${moduloDoble.id_modulo_dos} `}
                                                    </option>
                                                ))
                                                : <option>NO HAY MÓDULOS DOBLES DISPONIBLES</option>
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col xs={12} sm={12} >Fechas del contrato</Col>
                            <Col xs={12} sm={12} className="text-descripcion-agregar">
                                Cantidad de meses: {calcDifMeses(newContrato.fecha_d_alquiler, newContrato.fecha_h_alquiler)}
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Inicio">
                                        <Form.Control onChange={handleChangeForm} name="fecha_d_alquiler" type="date" value={newContrato.fecha_d_alquiler} required />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Final">
                                        <Form.Control onChange={handleChangeForm} name="fecha_h_alquiler" type="date" value={newContrato.fecha_h_alquiler} required />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingInputGrid" label="Ubicación">
                                        <Form.Control onChange={handleChangeForm} name="ubicacion" type="text" value={newContrato.ubicacion} required />
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12}>
                                <FloatingLabel label="Total del alquiler">
                                    <NumericFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChangeForm} name="valor" value={newContrato.valor} required />
                                </FloatingLabel>
                            </Col>
                            <Col xs={12} sm={12} className="text-descripcion-agregar">
                                ${formatNumber(newContrato.alquiler_total ? newContrato.alquiler_total : 0)} + ${(newContrato.valor ? newContrato.valor : 0)} = ${formatNumber(new Decimal(newContrato.alquiler_total ? newContrato.alquiler_total : 0).add(newContrato.valor ? new Decimal(desformatNumber(newContrato.valor)) : 0).toNumber())}
                            </Col>
                        </Row>

                        {showModalValidation &&
                            <ValidacionNewContrato mostrar={showModalValidation} datos={newContrato} setShow={setShowModalValidation} setSubmit={handleSubmit} />
                        }

                        <Row>
                            <Button className="button-submit" variant="dark" type="submit">
                                Guardar
                            </Button>
                        </Row>
                    </Form>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

FormContrato.defaultProps = {
    alquiler: ''
}

export default React.memo(FormContrato);
