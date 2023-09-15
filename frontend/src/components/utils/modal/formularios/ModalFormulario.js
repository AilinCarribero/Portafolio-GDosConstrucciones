import React from "react";
import { Modal } from "react-bootstrap";

//Components
import FormModulos from "../../../views/modulos/FormModulos";
import FormProyectos from "../../../views/proyectos/FormProyectos";
import FormIngresosAlquiler from "../../../views/ingresosAlquiler/FormIngresosAlquiler";
import FormCliente from "../../../views/cliente/FormCliente";
import FormUsuarios from "../../../views/usuarios/FormUsuarios";
import FormEditIngresoAlquiler from "../../../views/ingresosAlquiler/FormEditIngresoAlquiler";

//Hooks
import { formatTextMix } from "../../../../hooks/useUtils";

//Css
import "../../../../style/Modal.scss";

const ModalFormulario = ({ formulario, show, setShow, updateNew, informacion }) => {
    const handleClose = () => setShow(false);

    return(<>
        <Modal show={show} onHide={handleClose} animation={false} className="content-modal">
            <Modal.Header className="content-modal-title" closeButton >
                <Modal.Title>
                    <b>{formatTextMix(formulario === 'ingresoAlquiler' ? 'Ingreso de alquires' : (formulario === 'editIngresoAlquiler' ? 'Editar Ingreso de un Alquiler' : formulario))}</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                {formulario == 'ingresoAlquiler' && <FormIngresosAlquiler close={handleClose} updateIngresoAlquiler={informacion} setUpdateIngresosAlquiler={updateNew} />}
                {formulario == 'editIngresoAlquiler' && <FormEditIngresoAlquiler close={handleClose} updateEditIngresoAlquiler={informacion} setUpdateEditIngresosAlquiler={updateNew} />}
                {formulario == 'modulo' && <FormModulos close={handleClose} updateModulo={informacion} setUpdateModulo={updateNew} />}
                {formulario == 'proyecto' && <FormProyectos close={handleClose} updateProyecto={informacion} setUpdateProyectos={updateNew} />}
                {formulario == 'cliente' && <FormCliente close={handleClose} updateCliente={informacion} setUpdateClientes={updateNew} />}
                {formulario == 'usuario' && <FormUsuarios close={handleClose} updateUsuario={informacion} setUpdateUsuarios={updateNew} />}
            </Modal.Body>
        </Modal>
    </>)
}

export default React.memo(ModalFormulario)