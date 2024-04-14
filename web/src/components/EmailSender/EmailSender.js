import React, {useState, useEffect} from 'react';
import {Grid, Typography, Button, TextField, Alert} from '@mui/material';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import axios from 'axios';

function EmailSender(props)
{
    const [email, setEmail] = useState('');
    const token = sessionStorage.getItem('token');
    const [accountInfo, setAccountInfo] = useState({});

    const schema = yup.object().shape({
        email: yup.string().required('Câmp obligatoriu').email('Adresă de email invalidă'),
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const getAccountInfo = () => {
        axios.get(`http://localhost:3001/email-sender/get-account-info/${props.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            setAccountInfo(response.data);
        })
        .catch((error) => {
            alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    useEffect(() => {
       getAccountInfo();
    }, []);

    const onSubmit =  () => {
        axios.post('http://localhost:3001/email-sender/send', {
            uuid_patient: props.uuid_patient,
            email: email,
        },
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                getAccountInfo();
                setEmail('');
            }
        })
        .catch((error) => {
            alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
                {accountInfo.status === 'N/A' && (
                    <>
                        <Alert severity='info' sx={{fontSize: '17px', width: '100%'}}>
                            În această secțiune aveți posibilitatea de a solicita generarea unui cod de acces pentru pacienți, 
                            acest cod fiind necesar pentru înregistrarea lor în aplicația mobilă.
                        </Alert>
                        <Typography sx={{py: 3, width: '100%'}}>Vă rugăm să introduceți adresa de email a pacientului pentru a trimite codul de acces către acesta.</Typography>
                        <Grid item xs={5}>
                            <TextField 
                                {...register('email')} 
                                value={email} 
                                name='email' 
                                type='text' 
                                label='Email' 
                                variant='outlined' 
                                onChange={(event) => setEmail(event.target.value)} 
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={7} sx={{alignItems: 'center', display: 'flex', pl: 3}}>
                            <Button variant='contained' size='large' type='submit'>TRIMITE</Button>
                        </Grid>
                        <Typography className='error'>{errors.email?.message}</Typography>
                    </>
                )}

                {accountInfo.status === 'Pending' && (
                    <Alert severity='success' sx={{fontSize: '17px', width: '100%'}}>
                        Codul de acces a fost trimis cu succes la adresa de email {accountInfo.email} în data de {accountInfo.created_on}. <br/>
                        {
                            (accountInfo.try_number === 1 || accountInfo.try_number === 2) && 
                            <>
                                Numărul de încercări rămase: {accountInfo.try_number}
                            </>
                        }
                        {
                            (accountInfo.try_number === 0) && 
                            <>
                                Ne pare rău, dar nu mai există posbilitatea de a retrimite un alt cod de acces. Vă mulțumim pentru înțelegere.
                            </>
                        }
                    </Alert>
                )}

                {(accountInfo.try_number === 1 || accountInfo.try_number === 2) && (
                    <>
                        <Typography sx={{py: 3, width: '100%'}}>Vă rugăm să introduceți adresa de email a pacientului pentru a retrimite codul de acces către acesta.</Typography>
                        <Grid item xs={5}>
                            <TextField 
                                {...register('email')} 
                                value={email} 
                                name='email' 
                                type='text' 
                                label='Email' 
                                variant='outlined' 
                                onChange={(event) => setEmail(event.target.value)} 
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={7} sx={{alignItems: 'center', display: 'flex', pl: 3}}>
                            <Button variant='contained' size='large' type='submit'>RETRIMITE</Button>
                        </Grid>
                        <Typography className='error'>{errors.email?.message}</Typography>
                    </>
                )}
            </Grid>
        </form>
    );
}

export default EmailSender;