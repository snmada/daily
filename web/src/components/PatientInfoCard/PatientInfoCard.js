import React, {useState, useEffect} from 'react';
import './PatientInfoCard.scss';
import {Grid, Typography, Button, Box, IconButton, TextField, LinearProgress,  Dialog, Alert, AppBar, Toolbar, Tooltip} from '@mui/material';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {
    ModeEditOutline as ModeEditOutlineIcon,
    Phone as PhoneIcon,
    Place as PlaceIcon,
    Event as EventIcon
} from '@mui/icons-material';

function PatientInfoCard({alert, setAlert})
{
    const [patientInfo, setPatientInfo] = useState({});
    const [initialCNP, setInitialCNP] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const token = sessionStorage.getItem('token');
    const decoded_token = jwtDecode(token);
    const param = useParams();
    const handleChange = (event) => setPatientInfo({...patientInfo,  [event.target.name]: event.target.value});
    const [existRecord, setExistRecord] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatientInfo();
        fetchSkinRecord();
    }, []);

    useEffect(() => {
        fetchPatientInfo();
    }, [open]);

    const handleOpen = () => {
        setInitialCNP(patientInfo.CNP);
        setOpen(true);
        fetchPatientInfo();
        reset();
    }

    const handleClose = () => {
        setOpen(false);
        fetchPatientInfo();
        setErrorMessage('');
        reset();
    }

    useEffect(() => {
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
            }, 5000); 
        }
    }, [alert]);

    const schema = yup.object().shape({
        firstname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        lastname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        CNP: yup.string().required('Câmp obligatoriu').min(13, 'CNP invalid').max(13, 'CNP invalid'),
        phone: yup.string().required('Câmp obligatoriu').matches(/^[0-9]+$/, 'Sunt acceptate doar cifre')
                  .min(10, 'Lungimea maximă este de 10 cifre').max(10, 'Lungimea maximă este de 10 cifre'),
        address: yup.string().max(45, 'Lungimea maximă este de 45 de caractere'),
        country: yup.string().ensure()
                    .when('address', {
                        is: (address) => address && address.trim().length > 0,
                        then: () => yup.string().required('Câmp obligatoriu')
                    })
                    .max(45, 'Lungimea maximă este de 45 de caractere'),
        weight: yup.number('Greutatea trebuie să fie un număr')
                   .typeError('Câmp obligatoriu')
                   .test('valid-weight', 'Greutatea trebuie să fie între 30 și 250 kg', function(value){
                        if(value === 0 || (value > 30 && value < 250)) 
                        {
                            return true;
                        }
                        return false;
                    }),
        height: yup.number('Înălțimea trebuie să fie un număr')
                    .typeError('Câmp obligatoriu')
                    .test('valid-height', 'Înălțimea trebuie să fie între 30 și 250 cm', function(value){
                        if(value === 0 || (value > 30 && value < 250)) 
                        {
                            return true;
                        }
                        return false;
                    })          
    });

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = () => {
        axios.put('http://localhost:3001/patient-profile/update-info', {
            uuid_patient: param.uuid_patient,
            uuid_doctor: decoded_token.uuid_doctor, 
            lastname: patientInfo.lastname,
            firstname: patientInfo.firstname,
            updated_CNP: patientInfo.CNP,
            initial_CNP: initialCNP,
            phone: patientInfo.phone,
            address: patientInfo.address,
            country: patientInfo.country,
            weight: patientInfo.weight,
            height: patientInfo.height
        },
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200) 
            {
                setAlert({
                    severity: 'success',
                    text: 'Datele au fost actualizate cu success'
                });
                handleClose(true);
            }
        })
        .catch((error) => {
            if(error.response.status === 409)
            {
                setErrorMessage(error.response.data);
            }
            else
            {
                setAlert({
                    severity: 'error',
                    text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
                });
                handleClose(true);
            }
        });
    };
    

    const fetchPatientInfo = () => {
        axios.get(`http://localhost:3001/patient-profile/patient-info/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setPatientInfo(response.data);
                setIsLoading(false);
            }
        })
        .catch((error) => {
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
            setIsLoading(false);
        });
    }

    const fetchSkinRecord = () => {
        axios.get(`http://localhost:3001/patient-skin-data/data/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setExistRecord(true);
            }
        })
        .catch((error) => {
            if(error.response.status === 404)
            {
                setExistRecord(false);
            }
            else
            {
                setAlert({
                    severity: 'error',
                    text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
                });
            }
        });
    }

    return(
        <>
        {
            isLoading?
            (
                <Box sx={{width: '100%'}}>
                    <LinearProgress/>
                </Box>
            )
            :
            (
                <>
                <div className='div-patient-info'>
                    <Grid container className='container-patient-info'>
                        <Grid item xs={7} className='patient-info-first-grid'>
                            <Typography className='name'>{patientInfo.lastname.toUpperCase()} {patientInfo.firstname}</Typography>
                            <Typography className='cnp'>{patientInfo.CNP}</Typography>
                            <Typography className='phone'><PhoneIcon className='phone-icon'/> {patientInfo.phone}</Typography>
                            {
                                (patientInfo.address !== '' && patientInfo.country !== '') && 
                                <Typography className='address'><PlaceIcon className='place-icon'/> {patientInfo.address}, {patientInfo.country}</Typography>
                            }
                            {
                                (patientInfo.address == '' && patientInfo.country !== '') && 
                                <Typography className='address'><PlaceIcon className='place-icon'/> {patientInfo.country}</Typography>
                            }
                            <Grid container pt={2}>
                                <Grid item xs={12}>
                                    <Box className='box'>
                                        <EventIcon className='event-icon'/>
                                        <Typography className='typography'>Prima vizită</Typography>
                                        <Typography className='typography' mb={1}>{patientInfo.created_on}</Typography>
                                        {existRecord? (
                                            <Button  variant='outlined' onClick={() => navigate(`/patients/${param.uuid_patient}/skin-data`)}>VEZI FIȘA DE EVALUARE</Button>
                                        ):(<Button className='add-button' variant='contained' onClick={() => navigate(`/patients/${param.uuid_patient}/skin-data`)}>ADAUGĂ FIȘA DE EVALUARE</Button>)}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={5} className='patient-info-second-grid'>
                            <Grid item xs={12} className='grid-button'>
                                <Tooltip title={<h2>Editează datele pacientului</h2>}>
                                    <IconButton onClick={handleOpen}>
                                        <ModeEditOutlineIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                                    
                            <Grid item xs={12} px={3} py={5}> 
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Vârsta</Typography>
                                        <Typography>{patientInfo.age}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography>Gen</Typography>
                                        {
                                            patientInfo.gender === 'F'?
                                                <Typography>Feminin</Typography> : <Typography>Masculin</Typography>
                                        }
                                    </Grid>
                                                                    
                                    <Grid item xs={6} pt={3}>
                                        <Typography>Greutate</Typography>
                                        {
                                            patientInfo.weight === 0?
                                                <Typography>-</Typography> : <Typography>{patientInfo.weight} kg</Typography>
                                        }
                                    </Grid>
                                                                        
                                    <Grid item xs={6} pt={3}>
                                        <Typography>Înălțime</Typography>
                                        {
                                            patientInfo.height === 0?
                                                <Typography>-</Typography> : <Typography>{patientInfo.height} cm</Typography>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>

                <Dialog fullScreen open={open} onClose={handleClose} className='dialog-edit'>
                    <AppBar className='appbar'>
                        <Toolbar>
                            <Button className='save-button' type='submit' form='form' variant='contained'>Salvează</Button>
                            <Button className='cancel-button' variant='outlined' onClick={handleClose}>Anulează</Button>
                        </Toolbar>
                    </AppBar>

                    <form onSubmit={handleSubmit(onSubmit)} id='form' noValidate>
                        <Grid container className='grid-container' pt={10}>
                            <Grid container className='grid-form'>
                                <Grid item xs={12} pb={5}>
                                    <Typography className='title'>
                                        Formular pentru actualizarea datelor pacientului
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} py={1}>
                                    <TextField 
                                        {...register('lastname')} 
                                        value={patientInfo.lastname}
                                        name='lastname' 
                                        type='text' 
                                        label='Nume' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.lastname?.message}</Typography>
                                </Grid>
                                <Grid item xs={6} py={1} pl={1}>
                                    <TextField 
                                        {...register('firstname')} 
                                        value={patientInfo.firstname} 
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
                                        value={patientInfo.CNP} 
                                        name='CNP' 
                                        type='text' 
                                        label='CNP (Cod Numeric Personal)' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.CNP?.message}</Typography>
                                    {errorMessage &&  <Alert severity='error' width={'100%'}>{errorMessage}</Alert>}
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('phone')} 
                                        value={patientInfo.phone} 
                                        name='phone' 
                                        type='text' 
                                        label='Telefon' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.phone?.message}</Typography>
                                </Grid>
                                <Grid item xs={7} py={1}>
                                    <TextField 
                                        {...register('address')} 
                                        value={patientInfo.address} 
                                        name='address' 
                                        type='text' 
                                        label='Domiciliu' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.address?.message}</Typography>
                                </Grid>
                                <Grid item xs={5} py={1} pl={1}>
                                    <TextField 
                                        {...register('country')} 
                                        value={patientInfo.country} 
                                        name='country' 
                                        type='text' 
                                        label='Țară' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.country?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} py={1}>
                                    <TextField
                                        {...register('weight')} 
                                        label='Greutate (kg)'
                                        type='number'
                                        name='weight'
                                        value={patientInfo.weight}
                                        sx={{width: '100%'}}
                                        InputProps={{
                                            inputProps: {
                                                min: 30, max: 250, step: 1,
                                                title: 'Greutatea trebuie să fie cuprinsă între 30 și 250 kg'
                                            }
                                        }}
                                        onChange={handleChange}
                                    />
                                    <Typography className='error'>{errors.weight?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} py={1} pl={1}>
                                    <TextField
                                        {...register('height')} 
                                        label='Înălțime (cm)'
                                        type='number'
                                        name='height'
                                        value={patientInfo.height}
                                        sx={{width: '100%'}}
                                        InputProps={{
                                            inputProps: {
                                                min: 30, max: 250, step: 1,
                                                title: 'Înălțimea trebuie să fie cuprinsă între 30 și 250 cm'
                                            }
                                        }}
                                        onChange={handleChange}
                                    />
                                    <Typography className='error'>{errors.height?.message}</Typography>
                                </Grid>
                            </Grid>
                        </Grid> 
                    </form>
                </Dialog>
                </>
            )
        }
        </>
    );
}

export default PatientInfoCard;