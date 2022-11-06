import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { setAuth } from '../../services/config';
import { getApiModulo } from '../../services/api/apiModulo';
import { ToastComponent } from '../../components/ToastComponent';

const Auth = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');

    const handleChange = (e) => {
        const targetValue = e.target.value;

        setPassword(targetValue);
    }

    const handleClick = (e) => {
        e.preventDefault();

        setAuth(password);

        getApiModulo(token).then(res => {
            if (!res || res.status != 200) {
                ToastComponent('error', 'El código es incorrecto');
                console.error(res);
            } else {
                if (!res.data) {
                    ToastComponent('error', 'El código es incorrecto');
                    console.error(res);
                } else {
                    const tokenInfo = res.data;

                    sessionStorage.setItem("auth_ok", tokenInfo);

                    navigate(`/modulo/${tokenInfo}`);
                }
            }
        }).catch(err => {
            ToastComponent('error', 'El código es incorrecto');
            console.error(err);
        });
    }

    return (
        <div className='content-card'>
            <form>
                <Grid container spacing={2} >
                    <Grid item xs={12} sm={12}>
                        <h3>Para poder visualizar la información tienes que ingresar el código de verificación</h3>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField className='text-field' label="Código" variant="outlined" type="password" name="password" value={password} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <button type='submit' onClick={handleClick} >Ver información</button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default React.memo(Auth)