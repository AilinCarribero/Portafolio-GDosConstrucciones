import React from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col } from 'react-bootstrap';

//Hooks
import { formatNumber } from '../../../hooks/useUtils';
import { useGetIngresosId } from '../../../hooks/useIngresos';
import AccordionIngreso from './AccordionIngreso';

const Ingresos = () => {
    const { id } = useParams();
    const { ingresos, setIngresos } = useGetIngresosId(id);

    const SumatoriaIngresos = () => {
        let sumaIngreso = 0;
        ingresos.map(ingreso => {
            sumaIngreso += ingreso.valor_cobro;
        });

        return formatNumber(sumaIngreso);
    }

    const SumatoriaIngresosUSD = () => {
        let sumaIngreso = 0;
        ingresos.map(ingreso => {
            sumaIngreso += ingreso.valor_usd;
        })

        return formatNumber(sumaIngreso);
    }

    return (<>
        <Row>
            <Col md={6} className="titulo-ingresos-vista">Ingresos de {id} </Col>
            <Col xs={5} md={2} className="titulo-ingresos-vista">${SumatoriaIngresos()}</Col>
            <Col xs={5} md={2} className="titulo-ingresos-vista">USD${SumatoriaIngresosUSD()}</Col>
        </Row>
        <Row className="acordion">
            <Accordion>
                {
                    ingresos && ingresos.length > 0 ?
                        ingresos.map(ingreso => (
                            <AccordionIngreso key={ingreso.id_ingreso} ingreso={ingreso} setIngresos={setIngresos} />
                        ))
                        : <Col>
                            <h6>No existen ingresos</h6>
                        </Col>
                }
            </Accordion>
        </Row>
    </>)
}

export default React.memo(Ingresos);
