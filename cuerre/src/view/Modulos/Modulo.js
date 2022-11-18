import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import { Grid } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

import { formatNumber } from '../../utils/numbers';

const Modulo = () => {
  const { token } = useParams();

  const [infoModulo, setInfoModulo] = useState(decodeToken(token));

  useEffect(() => {
    setInfoModulo(decodeToken(token));
  
    return () => {}
  }, [])
  

  const auth_ok = sessionStorage.getItem("auth_ok");

  return (infoModulo &&
    <Grid container spacing={1} className="content-info">
      <Grid item>
        <h3>{`${infoModulo.tipologia} - ${formatNumber(infoModulo.ancho)} x ${formatNumber(infoModulo.largo)} - ${infoModulo.material_cerramiento} - ${infoModulo.id_modulo}`}</h3>
      </Grid>
      <Grid item xs={12} sm={12}><b>Color Exterior: </b>{infoModulo.col_exterior}</Grid>
      <Grid item xs={12} sm={12}><b>Color Interior: </b>{infoModulo.col_interior}</Grid>
      <Grid item xs={12} sm={12}><b>Equipamiento: </b>{infoModulo.equipamiento}</Grid>
      <Grid item xs={12} sm={12}><b>Fecha de Creación: </b>{infoModulo.fecha_creacion}</Grid>
      <Grid item xs={12} sm={12}><b>Largo: </b>{infoModulo.largo}</Grid>
      <Grid item xs={12} sm={12}><b>Material de Cerramiento: </b>{infoModulo.material_cerramiento}</Grid>
      <Grid item xs={12} sm={12}><b>Material del Piso: </b>{infoModulo.material_piso}</Grid>
      <Grid item xs={12} sm={12}><b>Cantidad de Puertas: </b>{infoModulo.puertas}</Grid>
      <Grid item xs={12} sm={12}><b>Tipologia: </b>{infoModulo.tipologia}</Grid>
      <Grid item xs={12} sm={12}><b>Cantidad de Ventanas: </b>{infoModulo.ventanas}</Grid>
      <Grid item xs={12} sm={12}><b>Tamaño de las Ventanas: </b>{infoModulo.vent_dimension}</Grid>
      <Grid item xs={12} sm={12}><b>Instalación Eléctrica: </b>{infoModulo.inst_electrica ? <CheckBoxIcon className='icon' fontSize='small' color='success' /> : <DisabledByDefaultIcon className='icon' fontSize='small' color='error'/>}</Grid>
      <Grid item xs={12} sm={12}><b>Instalaciones Especiales: </b>{infoModulo.inst_especiales ? <CheckBoxIcon className='icon' fontSize='small' color='success' /> : <DisabledByDefaultIcon className='icon' fontSize='small' color='error' />}</Grid>
      <Grid item xs={12} sm={12}><b>Instalación Sanitaria: </b>{infoModulo.inst_sanitaria ? <CheckBoxIcon className='icon' fontSize='small' color='success' /> : <DisabledByDefaultIcon className='icon' fontSize='small' color='error' />}</Grid>
      <Grid item xs={12} sm={12}><b>Descripción: </b>{infoModulo.descripcion}</Grid>
    </Grid>
  )
}

export default React.memo(Modulo);