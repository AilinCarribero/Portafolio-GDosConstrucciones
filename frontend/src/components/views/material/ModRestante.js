import React, { useState } from "react";
import { Form, Button, Modal, FloatingLabel } from "react-bootstrap";
import NumberFormat from "react-number-format";

//Hooks
import { ToastComponent } from "../../../hooks/useUtils";

//Services
import { updateStock } from "../../../services/apiStock";

const ModRestante = ({ show, stock, setShow, setStock }) => {
    const [cambiar, setCambiar] = useState({
        id_stock: stock.id_stock,
        mas_stock: 0,
        restante_valor: stock.restante_valor,
        valor: stock.valor
    });

    const handleChange = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        setCambiar(prevCambiar => ({
            ...prevCambiar,
            [targetName]: targetValue
        }));
    }

    const handleClose = () => setShow(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let resUpdateStock = [];

        try {
            resUpdateStock = await updateStock(cambiar);   
        } catch (error) {
            console.log(error);
            ToastComponent('error');
        }

        if (resUpdateStock.data.todoOk == 'Ok' || resUpdateStock.statusText == 'OK' || resUpdateStock.status == 200) {
            ToastComponent('success');
            
            setStock(resUpdateStock.data);
            setCambiar({
                id_stock: '',
                mas_stock: 0,
                restante_valor: 0,
                valor: 0
            });
            setShow(false);
        } else {
            ToastComponent('error');
        }
    }

    return (<>
        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <b>Ingresa el nuevo valor</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel className="mod-restante-input" controlId="floatingInputGrid" label="Sumar a lo existente">
                        <NumberFormat customInput={Form.Control} decimalSeparator={","} thousandSeparator={"."}
                            onChange={handleChange} name={"mas_stock"} value={cambiar.mas_stock} required />
                    </FloatingLabel>
                    <Button className="button-submit" variant="dark" type="submit">
                        Guardar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </>)
}

export default React.memo(ModRestante);