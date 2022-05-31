import React from "react";

//Components
import { Modal } from "react-bootstrap";
import FormEgresos from "../../../views/egresos/FormEgresos";
import FormIngresos from "../../../views/ingresos/FormIngresos";
import FormMateriales from "../../../views/material/FormMateriales";
import FormModulos from "../../../views/modulos/FormModulos";
import FormProyectos from "../../../views/proyectos/FormProyectos";

//Css
import "./Modal.css";

const ModalFormulario = ({ formulario, show, setShow, updateNew, informacion }) => {
    const handleClose = () => setShow(false);

    return(<>
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <b>Furmulario de {formulario}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                {formulario == 'materiales' && <FormMateriales close={handleClose} setStock={updateNew} />}
                {formulario == 'egreso' && <FormEgresos close={handleClose} updateEgreso={informacion} setUpdateEgresos={updateNew} />}
                {formulario == 'ingreso' && <FormIngresos close={handleClose} updateIngreso={informacion} setUpdateIngresos={updateNew} />}
                {formulario == 'modulo' && <FormModulos close={handleClose} updateModulo={informacion} setUpdateModulo={updateNew} />}
                {formulario == 'proyecto' && <FormProyectos close={handleClose} updateProyecto={informacion} setUpdateProyectos={updateNew} />}
            </Modal.Body>
        </Modal>
    </>)
}

export default React.memo(ModalFormulario)