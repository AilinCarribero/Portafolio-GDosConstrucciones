import React, { useState } from 'react'
import { Button, Col, FloatingLabel, Form, Modal, Row, Spinner } from 'react-bootstrap';

//Hooks
import { useResponse } from '../../../hooks/useResponse';
import { formatNumber, ToastComponent } from '../../../hooks/useUtils';

//Service
import { setApiVincularModulo } from '../../../services/apiModulos';

const ModalVinculacion = ({ show, setShow, modulos, setModulos }) => {
    const { response } = useResponse();

    const handleClose = () => setShow(false);

    const [showSpinner, setShowSpinner] = useState(false);

    const [dataVinculacion, setDataVinculacion] = useState({
        id_modulo_uno: '',
        id_modulo_dos: ''
    })

    const handleChangeForm = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setDataVinculacion(prevDataVinculacion => ({
                ...prevDataVinculacion,
                [targetName]: targetValue
            }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setShowSpinner(true);
            const resVinculacion = await setApiVincularModulo(dataVinculacion);

            const res = response(resVinculacion);

            if (res) {
                ToastComponent('success');
                
                setDataVinculacion({
                    id_modulo_uno: '',
                    id_modulo_dos: ''
                })

                setShowSpinner(false);
                setModulos(resVinculacion.data.data)
                setShow(false);
            } else {
                setShowSpinner(false);
                ToastComponent('error', resVinculacion.data.todoMal && resVinculacion.data.todoMal);
            }
        } catch (err) {
            setShowSpinner(false);
            console.error(err);
            ToastComponent('error');
        }
    }

    return (
        <Modal show={show} onHide={handleClose} animation={false} className="content-modal-alertas">
            <Modal.Header closeButton className="content-modal-header"><b>Generar Módulo Doble</b></Modal.Header>
            <Modal.Body className="content-modal-body">
                <Form onSubmit={handleSubmit}>
                    <Row className='content-select'>
                        <Col sm={12}>
                            <FloatingLabel label="Módulo 1" >
                                <Form.Select onChange={handleChangeForm} name="id_modulo_uno" value={dataVinculacion.id_modulo_uno}>
                                    <option value=""></option>
                                    {modulos.length > 1 ?
                                        modulos.map((modulo) => (
                                            modulo.estado === 0 && !modulo.vinculado && <option key={modulo.id_modulo} value={modulo.id_modulo}>
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
                    </Row>
                    <Row className='content-select'>
                        <Col sm={12}>
                            <FloatingLabel label="Módulo 2" >
                                <Form.Select onChange={handleChangeForm} name="id_modulo_dos" value={dataVinculacion.id_modulo_dos}>
                                    <option value=""></option>
                                    {modulos.length > 1 ?
                                        modulos.map((modulo) => (
                                            modulo.estado === 0 && !modulo.vinculado && <option key={modulo.id_modulo} value={modulo.id_modulo}>
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
                    </Row>
                    <Row className="content-modal-buttons">
                        <Button type='submit' variant="dark" disabled={showSpinner}>
                            {showSpinner ?  <Spinner animation="border" variant="light" size='sm' /> : "Vincular"}
                        </Button>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalVinculacion