import React, { useState, useEffect } from 'react';
import { Accordion, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Components
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import AccordionCentroCosto from "./AccordionCentroCosto";

//Hooks
import { formatFecha, formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';
import { useGetProyectos } from '../../../hooks/useProyectos';

const CentrosCostos = ({ proyectos, mostrar, setProyectos }) => {
    const { user } = useUser();

    const [proyectosMostrar, setProyectosMostrar] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formulario, setFormulario] = useState();

    useEffect(() => {
        if (proyectos) {
            setProyectosMostrar(
                proyectos.filter(proyecto => {
                    if (mostrar == 'proyectos' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total <= 0) {
                        return proyecto
                    } else if (mostrar == 'alquileres' && proyecto.id_proyecto.includes('CCP') && proyecto.alquiler_total > 0) {
                        return proyecto
                    } else if (mostrar == 'ccc-cce' && (proyecto.id_proyecto.includes('CCC') || proyecto.id_proyecto.includes('CCE'))) {
                        return proyecto
                    }
                })
            );
        }
    }, [proyectos, mostrar]);

    //Que formulario abrir
    const setShowFormSelccion = (form) => {
        setFormulario(form)
        setShowForm(!showForm);
    }

    return (<>
        <Row className="conten-buttons-agregar">
            <Col xs={6} sm={6} md={4}>
                <Button className="button-agregar" onClick={() => setShowFormSelccion('egreso')} variant="dark" >
                    <Icons.Plus className="icon-button" size={19} />
                    Agregar Egreso
                </Button>
            </Col>
            {user.rango != "usuario comun" && <>
                <Col xs={6} sm={6} md={4}>
                    <Button className="button-agregar" onClick={() => setShowFormSelccion('ingreso')} variant="dark" >
                        <Icons.Plus className="icon-button" size={19} />
                        Agregar Ingreso
                    </Button>
                </Col>
                {user.rango == 'admin' &&
                    <Col xs={6} sm={6} md={4}>
                        <Button className="button-agregar" onClick={() => setShowFormSelccion('proyecto')} variant="dark">
                            <Icons.Plus className="icon-button" size={19} />
                            Agregar proyecto
                        </Button>
                    </Col>
                }
            </>}
        </Row>

        <ModalFormulario formulario={formulario} show={showForm} setShow={setShowForm} updateNew={formulario == 'proyecto' && setProyectos} />

        <Accordion>
            {
                proyectosMostrar &&
                proyectosMostrar.map(proyecto => (
                    <AccordionCentroCosto key={proyecto.id_proyecto} proyecto={proyecto} setProyectos={setProyectos} />
                ))
            }
        </Accordion>
    </>)
}

export default React.memo(CentrosCostos);