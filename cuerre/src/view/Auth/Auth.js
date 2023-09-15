import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import { CircularProgress } from '@mui/joy';
import { useNavigate, useParams } from 'react-router-dom';

import { setAuth } from '../../services/config';
import { getApiModulo } from '../../services/api/apiModulo';
import { ToastComponent } from '../../components/ToastComponent';

const Auth = () => {
    const navigate = useNavigate();

    const { token } = useParams();

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const targetValue = e.target.value;

        setPassword(targetValue);
    }

    const handleClick = (e) => {
        e.preventDefault();
        setLoading(true);

        setAuth(password);

        getApiModulo(token).then(res => {
            setLoading(false);

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
            setLoading(false);

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
                        <button type='submit' onClick={handleClick} >{loading ? <CircularProgress color="neutral" /> : 'Ver información'}</button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default React.memo(Auth)