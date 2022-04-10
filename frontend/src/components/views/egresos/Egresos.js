import React from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, Row, Col } from 'react-bootstrap';

//Components
import AccordionEgreso from './AccordionEgreso';

//Hooks
import { useGetEgresosId } from '../../../hooks/useEgresos';
import { formatNumber } from '../../../hooks/useUtils';
import { useUser } from '../../../hooks/useUser';

//Css
import './Egresos.css';

const Egresos = () => {
    const { id } = useParams();
    const { user } = useUser();
    const { egresos, setEgresos } = useGetEgresosId(id);

    const SumatoriaEgresos = () => {
        let sumaEgreso = 0;
        egresos.map(egreso => {
            sumaEgreso += egreso.valor_pago;
        });

        return formatNumber(sumaEgreso);
    }

    const SumatoriaEgresosUSD = () => {
        let sumaEgreso = 0;
        egresos.map(egreso => {
            sumaEgreso += egreso.valor_usd;
        })

        return formatNumber(sumaEgreso);
    }

    return (<>
        <Row>
            <Col md={5} className="titulo-egresos-vista">Egresos de {id} </Col>
            <Col xs={5} md={2} className="titulo-egresos-vista">${SumatoriaEgresos()}</Col>
            <Col xs={5} md={2} className="titulo-egresos-vista">USD${SumatoriaEgresosUSD()}</Col>
        </Row>
        <Row className="acordion">
            <Accordion>
                {egresos.length > 0 ?
                    egresos.map(egreso => (
                        egreso.analisis_costo.analisis_costo == "Sueldo" ? user.rango == 'admin' &&
                            <AccordionEgreso key={egreso.id_egreso} egreso={egreso} setEgresos={setEgresos} />
                            :
                            <AccordionEgreso key={egreso.id_egreso} egreso={egreso} setEgresos={setEgresos} />
                    ))
                    : <Col>
                        <h6>No existen egresos</h6>
                        <p>Agregar icono de alerta</p>
                    </Col>
                }
            </Accordion>
        </Row>
    </>)
}

export default React.memo(Egresos);
