import React, { useEffect, useState } from 'react';
import ModalFormulario from '../../utils/modal/formularios/ModalFormulario';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { useUser } from '../../../hooks/useUser';

//Icons
import * as Icons from 'react-bootstrap-icons';

//Css
import '../../../style/Cliente.scss';
import { getApiClientes } from '../../../services/apiClientes';
import { ToastComponent } from '../../../hooks/useUtils';

const Clientes = () => {
  const { user } = useUser();

  const [clientes, setClientes] = useState([]);
  const [updateCliente, setUpdateCliente] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);

    getApiClientes().then(res => {
      setClientes(res.data);

      setLoading(false);
    }).catch(err => {
      ToastComponent('error', 'Ocurrio un error al querer cargar los clientes')
      console.error(err);

      setLoading(false);
    })
  }, []);

  const updateModalCliente = (cliente) => {
    setUpdateCliente(cliente);
    setShowForm(true);
  }

  const showFormNewCliente = () => {
    setUpdateCliente([]);
    setShowForm(true);
  }

  return (<>
    <ModalFormulario formulario={'cliente'} show={showForm} setShow={setShowForm} updateNew={setClientes} informacion={updateCliente} />

    <Row className="conten-buttons-agregar">
      {(user.rango == 'admin') && <>
        <Col xs={12} sm={6} md={3} lg={2}>
          <button className="button-agregar" onClick={() => showFormNewCliente()} variant="dark">
            <Icons.Plus className="icon-button" size={19} /> Nuevo Cliente
          </button>
        </Col>
      </>}
    </Row>

    {loading ?
      <Row className='spinner-center-pag' >
        <Spinner animation="border" variant="dark" />
      </Row>
      :
      <Row className='conteiner-cards-clientes'>
        {clientes.map(cliente =>
          <Col xs={12} sm={6} md={3} lg={2} key={cliente.id_cliente} className='col-card-cliente'>
            <Card className='card-content-cliente'>
              <Card.Body>
                <Card.Title className='card-title-cliente'>{cliente.nombre}</Card.Title>
                <Card.Text>Dirección: {cliente.direccion ? cliente.direccion : '-'} </Card.Text>
                <Card.Text>E-mail: {cliente.correo ? cliente.correo : '-'}</Card.Text>
                <Card.Text>Teléfono: {(cliente.telefono && cliente.telefono != 0) ? cliente.telefono : '-'}</Card.Text>
              </Card.Body>
              <Card.Footer className='card-footer-cliente'>
                <Row>
                  <Col>
                    <button className="button-action" onClick={() => updateModalCliente(cliente)}>
                      <Row>
                        <Col xs={1} md={1} className='icon-action'>
                          <Icons.PencilSquare size={19} />
                        </Col>
                        <Col xs={10} md={10} className='text-action'>
                          Modificar
                        </Col>
                      </Row>
                    </button>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>
    }
  </>)
}

export default React.memo(Clientes);