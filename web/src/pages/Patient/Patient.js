import React, {useState} from 'react';
import {Grid, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Alert} from '@mui/material';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import NavBar from '../../components/NavBar/NavBar.js';
import SideBar from '../../components/SideBar/SideBar.js';
import './Patient.scss';

const initialState = {firstname: '', lastname: '', CNP: '', phone: '', address: '', country: ''};

function Patient()
{
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);

    const [formData, setFormData] = useState(initialState);

    const handleChange = (event) => setFormData({...formData, [event.target.name]: event.target.value});

    const handleClickOpen = () => setOpen(true);
    
    const handleClose = () => setOpen(false);

    const schema = yup.object().shape({
        firstname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        lastname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        CNP: yup.string().required('Câmp obligatoriu').min(13, 'CNP invalid').max(13, 'CNP invalid'),
        phone: yup.string().required('Câmp obligatoriu').matches(/^[0-9]+$/, 'Sunt acceptate doar cifre')
                    .min(10, 'Lungimea maximă este de 10 cifre').max(10, 'Lungimea maximă este de 10 cifre'),
        address: yup.string().max(45, 'Lungimea maximă este de 45 de caractere'),
        country: yup.string().max(45, 'Lungimea maximă este de 45 de caractere'),
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit =  () => {
        const token = sessionStorage.getItem('token');
        const decoded_token = jwtDecode(token);

        axios.post('http://localhost:3001/patient/add', {
            uuid_doctor: decoded_token.uuid_doctor, 
            lastname: formData.lastname,
            firstname: formData.firstname,
            CNP: formData.CNP,
            phone: formData.phone,
            address: formData.address,
            country: formData.country
        },
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                navigate(`/patient-profile/${response.data.uuid_patient}`);
                sessionStorage.setItem('uuid_patient', response.data.uuid_patient);
            }
        })
        .catch((error) => {
            (error.response.status === 409)? 
                setErrorMessage(error.response.data) : alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    };

    return(
        <Grid container className='patient'>
            <SideBar/>
            <Grid item className='main-content'>
                <NavBar title='Patients'/>
                <Button variant='contained' onClick={handleClickOpen}>Adaugă pacient</Button>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Pacient Nou</DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent sx={{width: '500px'}}>

                            <DialogContentText pb={2}>
                                Te rugăm să introduci următoarele date: 
                            </DialogContentText>
                        
                            <Grid container py={2}>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('lastname')} 
                                        value={formData.lastname} 
                                        name='lastname' 
                                        type='text' 
                                        label='Nume' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.lastname?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('firstname')} 
                                        value={formData.firstname} 
                                        name='firstname' 
                                        type='text' 
                                        label='Prenume' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.firstname?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('CNP')} 
                                        value={formData.CNP} 
                                        name='CNP' 
                                        type='text' 
                                        label='CNP (Cod Numeric Personal)' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.CNP?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('phone')} 
                                        value={formData.phone} 
                                        name='phone' 
                                        type='text' 
                                        label='Telefon' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.phone?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('address')} 
                                        value={formData.address} 
                                        name='address' 
                                        type='text' 
                                        label='Domiciliu' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.address?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('country')} 
                                        value={formData.country} 
                                        name='country' 
                                        type='text' 
                                        label='Țară' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.country?.message}</Typography>
                                </Grid>
                            </Grid>   
                            {errorMessage &&  <Alert severity='error' width={'100%'}>{errorMessage}</Alert>}
                        
                        </DialogContent>
                        <DialogActions sx={{padding: '15px'}}>
                            <Button sx={{background: '#68B984', color: '#FBFBFB', '&:hover': {background: '#68B984'}}} type='submit'>Salvează</Button>
                            <Button onClick={handleClose}>Anulează</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Grid>
        </Grid>
    );
}

export default Patient;