import React, {useState, useEffect} from 'react';
import './PatientProfile.scss';
import {Grid, Typography, Button, Box, IconButton, TextField, Tab, Stepper, 
        Step, StepLabel, LinearProgress,  Dialog, Alert, AppBar, Toolbar} from '@mui/material';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {
    ArrowForwardIos as ArrowForwardIosIcon,
    ModeEditOutline as ModeEditOutlineIcon,
    Phone as PhoneIcon,
    Place as PlaceIcon,
    Event as EventIcon,
    ChecklistRtl as ChecklistRtlIcon,
    Delete as DeleteIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    ContentPaste as ContentPasteIcon
} from '@mui/icons-material';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import EmailSender from '../../components/EmailSender/EmailSender.js';


function PatientProfile()
{
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const token = sessionStorage.getItem('token');
    const decoded_token = jwtDecode(token);

    const param = useParams();

    const [patientInfo, setPatientInfo] = useState({});
    const [patientAllergies, setPatientAllergies] = useState([{}]);
    const [patientConsultations, setPatientConsultations] = useState([
        {date: '23-10-2021'},
        {date: '22-09-2021'},
        {date: '19-08-2021'}
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const handleAddAllergy = () => setIsEditing(true);

    const [initialCNP, setInitialCNP] = useState('');

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
                setInitialCNP(response.data.CNP);
                setIsLoading(false);
            }
        })
        .catch((error) => {
            (error.response.status === 500) && alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
            setIsLoading(false);
        });
    }

    const fetchPatientAllergies = () => {
        axios.get(`http://localhost:3001/patient-profile/patient-allergies/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setPatientAllergies(response.data);
            }
        })
        .catch((error) => {
            (error.response.status === 500) && alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    useEffect(() => {
        fetchPatientInfo();
        fetchPatientAllergies();
    }, []);

    const handleSaveAllergy = () => {
        if (newAllergy.trim() !== '') 
        {
            axios.post('http://localhost:3001/patient-profile/add-allergy', {
                uuid_patient: param.uuid_patient, 
                type: newAllergy
            },
            {
                headers:{
                    'authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                if(response.status === 200)
                {
                    fetchPatientAllergies();
                    setNewAllergy('');
                    setIsEditing(false);
                }
            })
            .catch((error) => {
                (error.response.status === 500) && alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
            });
        }
    }

    const handleRemoveAllergy = (id_allergy) => {
        axios.put(`http://localhost:3001/patient-profile/update-allergy/${id_allergy}`,{},
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                fetchPatientAllergies();
            }
        })
        .catch((error) => {
            (error.response.status === 500) && alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    const [tabValue, setTabValue] = useState('1');
    const handleChangeTabValue = (event, newValue) => setTabValue(newValue);

    const handleChange = (event) => setPatientInfo({...patientInfo,  [event.target.name]: event.target.value});

    useEffect(() => {
        fetchPatientInfo();
    }, [open])

    const handleOpen = () => {
        setOpen(true);
        fetchPatientInfo();
    }

    const handleClose = () => {
        setOpen(false);
        fetchPatientInfo();
    }

    const schema = yup.object().shape({
        firstname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        lastname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        CNP: yup.string().required('Câmp obligatoriu').min(13, 'CNP invalid').max(13, 'CNP invalid'),
        phone: yup.string().required('Câmp obligatoriu').matches(/^[0-9]+$/, 'Sunt acceptate doar cifre')
                    .min(10, 'Lungimea maximă este de 10 cifre').max(10, 'Lungimea maximă este de 10 cifre'),
        address: yup.string().max(45, 'Lungimea maximă este de 45 de caractere'),
        country: yup.string().max(45, 'Lungimea maximă este de 45 de caractere')
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit =  () => {
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
                alert(response.data);
            }
        })
        .catch((error) => {
            (error.response.status === 409)? 
                setErrorMessage(error.response.data) : alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    };

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
                <Grid container className='patient-profile'>
                    <SideBar/>
                    <Grid item className='main-content'>
                        <NavBar title='Patient Profile'/>
                        <Grid item xs={12} className='grid-item-path'>
                            <Typography className='path'>
                                Pacienți <ArrowForwardIosIcon className='arrow-icon'/>{patientInfo.lastname.toUpperCase()} {patientInfo.firstname}
                            </Typography>
                            <Button variant='contained' onClick={() => navigate(`/skin-data/${param.uuid_patient}`)}>Fișă pacient</Button>
                        </Grid>
                        <Grid container>
                            <Grid item xs={5}>
                                <div className='div-patient-info'>
                                    <Grid container className='container-patient-info'>
                                        <Grid item xs={7} className='patient-info-first-grid'>
                                            <Typography className='name'>{patientInfo.lastname.toUpperCase()} {patientInfo.firstname}</Typography>
                                            <Typography className='cnp'>{patientInfo.CNP}</Typography>
                                            <Typography className='phone'><PhoneIcon className='phone-icon'/> {patientInfo.phone}</Typography>
                                            <Typography className='address'><PlaceIcon className='place-icon'/> {patientInfo.address}, {patientInfo.country}</Typography>
                                        
                                            <Grid container >
                                                <Grid item xs={6}>
                                                    <Box className='box'>
                                                        <EventIcon className='event-icon'/>
                                                        <Typography className='typography'>Prima consultație</Typography>
                                                        <Typography className='typography'>25 Oct. 2021</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box className='box'>
                                                        <ChecklistRtlIcon className='check-icon'/>
                                                        <Typography className='typography'>Consultații</Typography>
                                                        <Typography className='typography'>10</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                    
                                        </Grid>
                                        <Grid item xs={5} className='patient-info-second-grid'>
                                            <Grid item xs={12} className='grid-button'>
                                                <IconButton onClick={handleOpen}><ModeEditOutlineIcon/></IconButton>
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
                            </Grid>
                            
                            <Grid item xs={4}>
                                <div className='div-treatment'>
                                    <Grid container className='container-treatment'>
                                        <Box className='title-box'>
                                            <Typography className='title'>Tratament actual</Typography> 
                                        </Box>
                                        <Box className='diagnosis-box'>
                                            <Typography className='diagnosis'>Afecțiune: ----</Typography>
                                        </Box> 
                                        <Box className='treatment-box'>
                                            -----------
                                        </Box>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={3}>
                                <Grid container className='container-allergies'>
                                    <Grid item xs={12}>
                                        <Typography className='title'>Alergii</Typography>
                                        <Box className='allergies-box'>
                                            {patientAllergies.map((allergy, index) => (
                                                <Box key={index} className='allergy-item'>
                                                    <Box flexGrow={1}>{allergy.type}</Box>
                                                    <IconButton onClick={() => handleRemoveAllergy(allergy.id_allergy)}><DeleteIcon className='delete-icon'/></IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                        {
                                            isEditing? 
                                            (
                                                <Box className='edit-box'>
                                                    <TextField
                                                        onChange={(event) => setNewAllergy(event.target.value)}
                                                        placeholder='Introduceți aici'
                                                        size='small'
                                                        sx={{flexGrow: 1, mr: 1}}
                                                    />
                                                    <IconButton onClick={handleSaveAllergy}><CheckIcon/></IconButton>
                                                    <IconButton onClick={() => setIsEditing(false)}><CloseIcon/></IconButton>
                                                </Box>
                                            )
                                            :
                                            (
                                                <Button className='add-button' onClick={handleAddAllergy}>+ ADAUGĂ</Button>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={9} pt={3}>
                                <div className='div-tabs'>
                                    <Grid container className='container-tabs'>
                                        <Grid item xs={12}>
                                            <TabContext value={tabValue}>
                                                <Box className='box-tab-list'>
                                                    <TabList onChange={handleChangeTabValue}>
                                                        <Tab label='Consultații' value='1'/>
                                                        <Tab label='Cod access - Aplicație mobilă' value='2'/>
                                                    </TabList>
                                                </Box>
                                                <TabPanel value='1'>
                                                    <Grid container className='container-tab-panel'>
                                                        <Grid item xs={12}>
                                                            <Stepper orientation='vertical' >
                                                                {patientConsultations.map((consultation, index) => (
                                                                    <Step key={index}>
                                                                        <StepLabel StepIconComponent={ContentPasteIcon}>
                                                                            <Grid container className='container-step'>
                                                                                <Grid item xs={10}>
                                                                                    <Typography>Data: {consultation.date}</Typography>
                                                                                </Grid>
                                                                                <Grid item xs={2} >
                                                                                    <Button>Vizualizare</Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </StepLabel>
                                                                    </Step>
                                                                ))}
                                                            </Stepper>
                                                        </Grid>
                                                    </Grid>
                                                </TabPanel>
                                            
                                                <TabPanel value='2'>
                                                    <EmailSender uuid_patient={param.uuid_patient}/>
                                                </TabPanel>
                                            </TabContext>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Dialog fullScreen open={open} onClose={handleClose}>
                        <AppBar sx={{position: 'relative'}}>
                            <Toolbar>
                                <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                                <Typography sx={{ml: 2, flex: 1}} variant='h6' component='div'>
                                    Editare Date Pacient
                                </Typography>
                                <Button autoFocus color='inherit' type='submit' onClick={onSubmit}>Salvează</Button>
                            </Toolbar>
                        </AppBar>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container sx={{justifyContent: 'center', pt: 10}}>
                                <Grid container sx={{width: '500px'}}>
                                    <Grid item xs={12} py={1}>
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
                                    <Grid item xs={12} py={1}>
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
                                    <Grid item xs={12} py={1}>
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
                                    <Grid item xs={12} py={1}>
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
                                            label='Greutate (kg)'
                                            type='number'
                                            name='weight'
                                            value={patientInfo.weight}
                                            sx={{paddingBottom: 2, width: '100%'}}
                                            InputProps={{
                                                inputProps: {
                                                    min: 30, max: 250, step: 1
                                                }
                                            }}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} py={1} pl={1}>
                                        <TextField
                                            label='Înălțime (cm)'
                                            type='number'
                                            name='height'
                                            value={patientInfo.height}
                                            sx={{paddingBottom: 2, width: '100%'}}
                                            InputProps={{
                                                inputProps: {
                                                    min: 30, max: 250, step: 1
                                                }
                                            }}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>   
                        </form>
                    </Dialog>
                </Grid>
            )
        }
        </>
    );
}

export default PatientProfile;