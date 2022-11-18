import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

//Hook
import { ToastComponent } from '../../../../hooks/useUtils';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { setCloseModalQr } from '../../../../redux/slice/QR/qrSlice';

//Img-Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import "../../../../style/Modal.scss";
const UrlQr = () => {
    const dispatch = useDispatch();

    const url = useSelector(state => state.qrRedux.urlQr);
    const show = useSelector(state => state.qrRedux.showModalUrlQr)

    const handleClose = () => dispatch(setCloseModalQr(false));

    const handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(url);
        ToastComponent('success', "Se copió correctamente");
    }

    return (
        <Modal show={show} onHide={handleClose} animation={false} className="content-modal">
            <Modal.Header className="content-modal-title" closeButton >
                <Modal.Title>
                    Aqui tienes tu URL para el QR
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                <Row>
                    <button className='text-ajust-content button-copy' onClick={(e) => handleCopy(e)} > <Icons.Link45deg size="25px" className='icon-text-copy' /> {url}</button>
                </Row>
                <Row className="button-contenedor">
                    <Col sm={12} xs={12}>
                        <Button className="button-validacion" variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default React.memo(UrlQr)