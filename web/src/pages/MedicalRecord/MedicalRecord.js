import React, {useState, useEffect} from 'react';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import './MedicalRecord.scss';
import {Grid, Typography, Button, Box, TextField, Paper, Slider} from '@mui/material';
import {Undo as UndoIcon} from '@mui/icons-material';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import CustomAlert from '../../components/CustomAlert/CustomAlert.js';

const initialState = {
    comedones: '', papules: '', pustules: '', nodules: '', cysts: '', affected_areas: '', observed_changes: '', 
    adverse_reactions: '', discomfort_level: '', quality_life_level: '', doctor_observations: '', patient_observations: ''
};

function MedicalRecord()
{
    const navigate = useNavigate();
    const param = useParams();
    const [formData, setFormData] = useState(
        {comedones: '', papules: '', pustules: '', nodules: '', cysts: '', affected_areas: '', observed_changes: '', 
        adverse_reactions: '', discomfort_level: '', quality_life_level: '', doctor_observations: '', patient_observations: ''}
    );
    const handleChange = (event) => setFormData({...formData, [event.target.name]: event.target.value});
    const token = sessionStorage.getItem('token');
    const [alert, setAlert] = useState(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
                navigate(`/patients/${param.uuid_patient}`);
            }, 5000); 
        }
    }, [alert]);

    const addMedicalRecord =  () => {
        if(!(JSON.stringify(formData) === JSON.stringify(initialState)))
        {
            for(const key in formData) 
            {
                if(!formData[key]) 
                {
                    formData[key] = 'N/A';
                }
            }
            axios.post('http://localhost:3001/patient-medical-record/add', {
                uuid_patient: param.uuid_patient, 
                comedones: formData.comedones, 
                papules: formData.papules, 
                pustules: formData.pustules, 
                nodules: formData.nodules, 
                cysts: formData.cysts, 
                affected_areas: formData.affected_areas, 
                observed_changes: formData.observed_changes, 
                adverse_reactions: formData.adverse_reactions, 
                discomfort_level: formData.discomfort_level, 
                quality_life_level: formData.quality_life_level, 
                doctor_observations: formData.doctor_observations, 
                patient_observations: formData.patient_observations
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
                    setDisabled(true);
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

    const discomfort_level = [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
        {value: 5, label: '5'},
        {value: 6, label: '6'},
        {value: 7, label: '7'},
        {value: 8, label: '8'},
        {value: 9, label: '9'},
        {value: 10, label: '10'}
    ];

    const quality_life_level = [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
        {value: 5, label: '5'},
        {value: 6, label: '6'},
        {value: 7, label: '7'},
        {value: 8, label: '8'},
        {value: 9, label: '9'},
        {value: 10, label: '10'}
    ];

    return(
        <Grid container className='medical-record'>
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
                        <Typography sx={{textAlign: 'center', fontSize: '25px'}} py={4}>Formular consultație</Typography>
                        <Grid item xs={12} className='grid-title' p={2}>
                            <Typography className='title'>Monitorizarea progresului</Typography>
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <Typography className='title'>Leziuni</Typography>
                            <Box className='box-lesion'>
                                <Typography className='name'>Comedoane: </Typography> 
                                <TextField 
                                    name='comedones'
                                    label='' 
                                    variant='standard'
                                    value={formData.comedones}
                                    onChange={handleChange}
                                    sx={{width: '100%'}}
                                    disabled={disabled}
                                />
                            </Box>
                            <Box className='box-lesion'>
                                <Typography className='name'>Papule: </Typography> 
                                <TextField 
                                    name='papules'
                                    label='' 
                                    variant='standard'
                                    value={formData.papules}
                                    onChange={handleChange}
                                    sx={{width: '100%'}}
                                    disabled={disabled}
                                />
                            </Box>
                            <Box className='box-lesion'>
                                <Typography className='name'>Pustule: </Typography> 
                                <TextField 
                                    name='pustules'
                                    label='' 
                                    variant='standard'
                                    value={formData.pustules}
                                    onChange={handleChange}
                                    sx={{width: '100%'}}
                                    disabled={disabled}
                                />
                            </Box>
                            <Box className='box-lesion'>
                                <Typography className='name'>Noduli: </Typography> 
                                <TextField 
                                    name='nodules'
                                    label='' 
                                    variant='standard'
                                    value={formData.nodules}
                                    onChange={handleChange}
                                    sx={{width: '100%'}}
                                    disabled={disabled}
                                />
                            </Box>
                            <Box className='box-lesion'>
                                <Typography className='name'>Chisturi: </Typography> 
                                <TextField 
                                    name='cysts'
                                    label='' 
                                    variant='standard'
                                    value={formData.cysts}
                                    onChange={handleChange}
                                    sx={{width: '100%'}}
                                    disabled={disabled}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <Typography pb={2} className='title'>Zone afectate</Typography>
                            <TextField 
                                name='affected_areas'
                                multiline 
                                placeholder='Introduceți aici.....' 
                                maxRows={4} 
                                style={{width: '100%'}}
                                value={formData.affected_areas}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <Typography pb={2} className='title'>Modificări observate</Typography>
                            <TextField 
                                name='observed_changes'
                                multiline 
                                placeholder='Introduceți aici.....' 
                                maxRows={4} 
                                style={{width: '100%'}}
                                value={formData.observed_changes}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <Typography pb={2} className='title'>Reacții adverse raportate</Typography>
                            <TextField 
                                name='adverse_reactions'
                                multiline 
                                placeholder='Introduceți aici.....' 
                                maxRows={4} 
                                style={{width: '100%'}}
                                value={formData.adverse_reactions}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <Typography pb={2} className='title'>Nivelul de durere/discomfort (scala 1-10)</Typography>
                                <Box px={10}>
                                    <Slider
                                        name='discomfort_level'
                                        defaultValue={1}
                                        value={formData.discomfort_level}
                                        onChange={handleChange}
                                        step={1}
                                        valueLabelDisplay='auto'
                                        marks={discomfort_level}
                                        min={1}
                                        max={10}
                                        disabled={disabled}
                                    />
                                </Box>
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <Typography pb={2} className='title'>Impactul asupra calității vieții (scala 1-10)</Typography>
                            <Box px={10}>
                                <Slider
                                    defaultValue={1}
                                    name='quality_life_level'
                                    value={formData.quality_life_level}
                                    onChange={handleChange}
                                    step={1}
                                    valueLabelDisplay='auto'
                                    marks={quality_life_level}
                                    min={1}
                                    max={10}
                                    disabled={disabled}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} className='grid-title' p={2} mt={2}>
                            <Typography className='title'>Observații suplimentare (medic)</Typography>
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <TextField 
                                name='doctor_observations'
                                multiline 
                                placeholder='Introduceți aici.....' 
                                maxRows={4} 
                                style={{width: '100%'}}
                                value={formData.doctor_observations}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid item xs={12} className='grid-title' p={2}>
                            <Typography className='title'>Observațiile pacientului</Typography>
                        </Grid>
                        <Grid item xs={12} py={2}>
                            <TextField 
                                name='patient_observations'
                                multiline 
                                placeholder='Introduceți aici.....' 
                                maxRows={4} 
                                style={{width: '100%'}}
                                value={formData.patient_observations}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </Grid>
                        <Grid item xs={12} className='grid-button' pt={2} pb={2}>
                            {
                                !disabled &&
                                <>
                                    <Button variant='contained' className='save-button' onClick={() => {addMedicalRecord()}}>SALVEAZĂ</Button>
                                    <Button variant='outlined' className='cancel-button' onClick={() => {navigate(`/patients/${param.uuid_patient}`)}}>ANULEAZĂ</Button>
                                </>
                            }
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default MedicalRecord;