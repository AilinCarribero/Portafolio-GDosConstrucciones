import React, { useState } from 'react'
import { Button, Form, Modal, Row, FloatingLabel, Col } from 'react-bootstrap'
import NumberFormat from 'react-number-format';
import Decimal from 'decimal.js-light';
import { useParams } from 'react-router-dom';
//Redux
import { useSelector } from 'react-redux';

//Componets
import ValidacionNewContrato from '../../utils/modal/validacion/ValidacionNewContrato';

//Hooks
import { desformatNumber, formatFechaISO, formatNumber, ToastComponent } from '../../../hooks/useUtils';
import { useGetModulos } from '../../../hooks/useModulos';

//Service
import { postNewContrato } from '../../../services/apiAlquileres';

const FormContrato = ({ alquiler, show, setShow, setAlquileres, actionContrato }) => {
    const { id } = useParams();
    const { modulos } = useGetModulos();

    const proyectos = useSelector(state => state.proyectoRedux.proyectos);
    const proyecto = proyectos.find(proyecto => proyecto.id_proyecto == id);

    const [newContrato, setNewContrato] = useState({
        id_alquiler: alquiler ? alquiler.id_alquiler : '',
        id_modulo: alquiler ? alquiler.id_modulo : '',
        alquiler: alquiler ? alquiler : '',
        proyecto: proyecto,
        nombre_modulo: alquiler ? alquiler.modulo.nombre_modulo : '',
        id_proyecto: id,
        alquiler_total: proyecto.alquiler_total,
        fecha_d_alquiler: alquiler ? formatFechaISO(alquiler.fecha_h_alquiler) : formatFechaISO(new Date()),
        fecha_h_alquiler: alquiler ? formatFechaISO(alquiler.fecha_h_alquiler) : '',
        valor: actionContrato == "modificar" ? alquiler.valor : '',
    });

    //Variables para validacion
    const [validated, setValidated] = useState(false);
    const [showModalValidation, setShowModalValidation] = useState(false);

    const handleClose = () => setShow(false);

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetCheck = e.target.checked;

        //console.log("tn: ", targetName, " tv: ", targetValue, " tc: ", targetCheck);

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
            resNewContrato = await postNewContrato(newContrato);

            if (resNewContrato && !resNewContrato.data.todoMal && (resNewContrato.data.todoOk == 'Ok' || resNewContrato.statusText == 'OK' || resNewContrato.status == 200)) {
                ToastComponent('success');
                
                setNewContrato({
                    id_alquiler: '',
                    id_modulo: '',
                    alquiler: '',
                    nombre_modulo: '',
                    id_proyecto: '',
                    alquiler_total: '',
                    fecha_d_alquiler: '',
                    fecha_h_alquiler: '',
                    valor: '',
                })

                setShow(false);
                setAlquileres(resNewContrato.data)
            } else {
                ToastComponent('error', resNewContrato.data.todoMal && resNewContrato.data.todoMal);
            }
        } catch (error) {
            console.log(error);
            ToastComponent('error');
        }
    }


    return (
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header className="content-modal-header" closeButton><b>Renovar Contrato del módulo {newContrato.nombre_modulo}</b></Modal.Header>
            <Modal.Body className="content-modal-body">
                <Row>
                    <Form noValidate validated={validated} onSubmit={handleValidacion}>
                        {!alquiler &&
                            <Row>
                                <Col>
                                    <FloatingLabel label="Módulo">
                                        <Form.Select onChange={handleChangeForm} name="id_modulo" required >
                                            <option value=""> </option>
                                            {modulos.length > 0 ?
                                                modulos.map((modulo) => (
                                                    modulo.estado === 0 && <option key={modulo.id_modulo} value={modulo.id_modulo}>
                                                        {modulo.nombre_modulo}
                                                    </option>
                                                ))
                                                : <option>NO HAY MÓDULOS DISPONIBLES</option>
                                            }
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col xs={12} sm={12} >Fechas del contrato</Col>
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
                        </Row>
                        <Row>
                            <Col xs={12} sm={12}>
                                <FloatingLabel label="Total del alquiler">
                                    <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                                        onChange={handleChangeForm} name="valor" value={newContrato.valor} required />
                                </FloatingLabel>
                            </Col>
                            <Col xs={12} sm={12} className="text-descripcion-agregar">
                                ${formatNumber(newContrato.alquiler_total ? newContrato.alquiler_total : 0)} + ${newContrato.valor ? newContrato.valor : 0} = ${formatNumber(new Decimal(newContrato.alquiler_total ? newContrato.alquiler_total : 0).add(newContrato.valor ? desformatNumber(newContrato.valor) : 0).toNumber())}
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
