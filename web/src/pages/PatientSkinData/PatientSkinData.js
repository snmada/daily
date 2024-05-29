import React, {useState, useEffect} from 'react';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import './PatientSkinData.scss';
import {Grid, Typography, Button, Box, TextField, LinearProgress, Paper, IconButton, Tooltip, Radio, RadioGroup, FormControlLabel, FormControl} from '@mui/material';
import {Undo as UndoIcon} from '@mui/icons-material';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import CustomAlert from '../../components/CustomAlert/CustomAlert.js';
import {ModeEditOutline as ModeEditOutlineIcon} from '@mui/icons-material';

const initialState = {phototype: '', skin_type: '', acne_type: '', acne_description: '', acne_localization: '', acne_severity: '', acne_history: '', treatment_history: '', observations: ''};

function PatientSkinData()
{
    const navigate = useNavigate();
    const param = useParams();
    const [formData, setFormData] = useState({phototype: '', skin_type: '', acne_type: '', acne_description: '', acne_localization: '', acne_severity: '', acne_history: '', treatment_history: '', observations: ''});
    const handleChange = (event) => setFormData({...formData, [event.target.name]: event.target.value});
    const token = sessionStorage.getItem('token');
    const [patient, setPatient] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [addMode, setAddMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
            }, 5000); 
        }
    }, [alert]);

    const phototypes = [
        {value: 'I', label: 'I'},
        {value: 'II', label: 'II'},
        {value: 'III', label: 'III'},
        {value: 'IV', label: 'IV'},
        {value: 'V', label: 'V'},
        {value: 'VI', label: 'VI'}
    ];

    const skin_types = [
        {value: 'normal', label: 'Normal'},
        {value: 'oily', label: 'Gras'},
        {value: 'dry', label: 'Uscat'},
        {value: 'mixed', label: 'Mixt'},
        {value: 'sensitive', label: 'Sensibil'}
    ];

    const acne_types = [
        {value: 'juvenile', label: 'Juvenilă'},
        {value: 'rosacea', label: 'Rozacee'},
        {value: 'vulgaris', label: 'Vulgară'},
        {value: 'cystic', label: 'Chistică'}
    ];

    const fetchSkinData = () => {
        axios.get(`http://localhost:3001/patient-skin-data/data/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setFormData(response.data);
                setAddMode(false);
                setDisabled(true);
                setIsLoading(false);
            }
        })
        .catch((error) => {
            if(error.response.status === 404)
            {
                setAddMode(true);
                setIsLoading(false);
            }
            else
            {
                setAlert({
                    severity: 'error',
                    text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
                });
                setIsLoading(false);
            }
        });
    }

    const addSkinData =  () => {
        if(!(JSON.stringify(formData) === JSON.stringify(initialState)))
        {
            for(const key in formData) 
            {
                if(!formData[key]) 
                {
                    formData[key] = 'N/A';
                }
            }
            axios.post('http://localhost:3001/patient-skin-data/add', {
                uuid_patient: param.uuid_patient, 
                phototype: formData.phototype, 
                skin_type: formData.skin_type, 
                acne_type: formData.acne_type, 
                acne_description: formData.acne_description,
                acne_localization: formData.acne_localization, 
                acne_severity: formData.acne_severity, 
                acne_history: formData.acne_history, 
                treatment_history: formData.treatment_history, 
                observations: formData.observations
            },
            {
                headers:{
                    'authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                if(response.status === 200)
                {
                    fetchSkinData();
                    setAddMode(false);
                    setDisabled(true);
                    setAlert({
                        severity: 'success',
                        text: 'Datele au fost salvate cu succes'
                    });
                    
                }
            })
            .catch((error) => {
                setAlert({
                    severity: 'error',
                    text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
                });
            });
        }
    };

    const updateSkinData = () => {
        axios.put('http://localhost:3001/patient-skin-data/update',{
            uuid_patient: param.uuid_patient, 
            phototype: formData.phototype, 
            skin_type: formData.skin_type, 
            acne_type: formData.acne_type, 
            acne_description: formData.acne_description,
            acne_localization: formData.acne_localization, 
            acne_severity: formData.acne_severity, 
            acne_history: formData.acne_history, 
            treatment_history: formData.treatment_history, 
            observations: formData.observations
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
                    text: 'Datele au fost salvate cu succes'
                });
            }
        })
        .catch((error) => {
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    }

    useEffect(() => {
        fetchSkinData();
    }, []);

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
                <Grid container className='skin-data'>
                    {alert && (<CustomAlert severity={alert.severity} text={alert.text}/>)}
                    <SideBar/>
                    <Grid item className='main-content'>
                        <NavBar title=''/>
                        <Grid item xs={12} className='grid-item-path'>
                            <Typography className='path'>
                                <Button startIcon={<UndoIcon/>} variant='contained' onClick={() => {navigate(`/patients/${param.uuid_patient}`)}}>Înapoi</Button>
                            </Typography>
                        </Grid>
                        <Grid container className='grid-container'>
                            <Paper elevation={5} className='paper'>
                                {
                                    (!addMode && !editMode) && 
                                    <Grid item xs={12} className='grid-button'>
                                        <Tooltip title={<h2>Editează fișa de evaluare</h2>}>
                                            <IconButton onClick={() => {setDisabled(false); setEditMode(true)}}>
                                                <ModeEditOutlineIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                }
                                <Grid item xs={12} pt={1} pb={4}>
                                    <Typography sx={{textAlign: 'center', fontSize: '25px'}}>FIȘĂ DE EVALUARE</Typography>
                                </Grid>
                                <Grid item xs={12} className='grid-title' p={2}>
                                    <Typography className='title'>Examinare fizică</Typography>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <FormControl disabled={disabled}>
                                        <Typography className='title'>Fototip cutanat</Typography>
                                        <RadioGroup row name='phototype' onChange={handleChange} value={formData.phototype}>
                                            {phototypes.map((val) => {
                                                return(
                                                    <FormControlLabel value={val.value} control={<Radio/>} label={val.label} key={val.value}/>
                                                )
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <FormControl disabled={disabled}>
                                        <Typography className='title'>Tip ten</Typography>
                                        <RadioGroup row name='skin_type' onChange={handleChange} value={formData.skin_type}>
                                            {skin_types.map((val) => {
                                                return(
                                                    <FormControlLabel value={val.value} control={<Radio/>} label={val.label} key={val.value}/>
                                                )
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <FormControl disabled={disabled}>
                                        <Typography className='title'>Tip acnee</Typography>
                                        <RadioGroup row name='acne_type' onChange={handleChange} value={formData.acne_type}>
                                            {acne_types.map((val) => {
                                                return(
                                                    <FormControlLabel value={val.value} control={<Radio/>} label={val.label} key={val.value}/>
                                                )
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Descrierea leziunilor</Typography>
                                    <TextField 
                                        disabled={disabled}
                                        name='acne_description'
                                        multiline 
                                        placeholder='Introduceți aici.....' 
                                        maxRows={4} 
                                        style={{width: '100%'}}
                                        value={formData.acne_description}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Localizarea leziunilor</Typography>
                                    <TextField 
                                        disabled={disabled}
                                        name='acne_localization'
                                        multiline 
                                        placeholder='Introduceți aici.....' 
                                        maxRows={4} 
                                        style={{width: '100%'}}
                                        value={formData.acne_localization}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Frecvența leziunilor</Typography>
                                    <TextField 
                                        disabled={disabled}
                                        name='acne_severity'
                                        multiline 
                                        placeholder='Introduceți aici.....' 
                                        maxRows={4} 
                                        style={{width: '100%'}}
                                        value={formData.acne_severity}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} className='grid-title' p={2}>
                                    <Typography className='title'>Istoricul acneei</Typography>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <TextField 
                                        disabled={disabled}
                                        name='acne_history'
                                        multiline 
                                        placeholder='Introduceți aici.....' 
                                        maxRows={4} 
                                        style={{width: '100%'}}
                                        value={formData.acne_history}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} className='grid-title' p={2}>
                                    <Typography className='title'>Istoricul tratamentelor anterioare</Typography>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <TextField 
                                        disabled={disabled}
                                        name='treatment_history'
                                        multiline 
                                        placeholder='Introduceți aici.....' 
                                        maxRows={4} 
                                        style={{width: '100%'}}
                                        value={formData.treatment_history}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} className='grid-title' p={2}>
                                    <Typography className='title'>Observații</Typography>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <TextField 
                                        disabled={disabled}
                                        name='observations'
                                        multiline 
                                        placeholder='Introduceți aici.....' 
                                        maxRows={4} 
                                        style={{width: '100%'}}
                                        value={formData.observations}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} className='grid-button' pt={2} pb={2}>
                                    {addMode && <Button variant='contained' className='save-button' onClick={() => {addSkinData()}}>SALVEAZĂ</Button>}
        
                                    {editMode && <Button variant='contained' className='save-button' onClick={() => {updateSkinData()}}>SALVEAZĂ DATELE MODIFICATE</Button>}
        
                                    {addMode && <Button variant='outlined' className='cancel-button' onClick={() => {navigate(`/patients/${param.uuid_patient}`)}}>ANULEAZĂ</Button>}
        
                                    {editMode && <Button variant='outlined' className='cancel-button' onClick={() => {setDisabled(true); setEditMode(false)}}>ANULEAZĂ</Button>}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
        </>
    );
}

export default PatientSkinData;