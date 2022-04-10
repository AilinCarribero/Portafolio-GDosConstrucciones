import React from "react";

//Components
import { Modal } from "react-bootstrap";
import FormEgresos from "../../../views/egresos/FormEgresos";
import FormMateriales from "../../../views/material/FormMateriales";

//Css
import "./Modal.css";

const ModalFormulario = ({ formulario, show, setShow, updateNew, informacion }) => {
    const handleClose = () => setShow(false);

    return(<>
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <b>Complete el formulario</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                {formulario == 'materiales' && <FormMateriales close={handleClose} setStock={updateNew} />}
                {formulario == 'egreso' && <FormEgresos close={handleClose} updateEgreso={informacion} setUpdateEgresos={updateNew} />}
                {formulario == 'ingreso' && <FormMateriales close={handleClose} updateIngreso={informacion} setUpdateIngresos={updateNew} />}
            </Modal.Body>
        </Modal>
    </>)
}

export default React.memo(ModalFormulario)