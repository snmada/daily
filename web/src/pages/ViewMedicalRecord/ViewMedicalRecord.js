import React, {useState, useEffect} from 'react';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import './ViewMedicalRecord.scss';
import {Grid, Typography, Button, Box, TextField, LinearProgress, Paper, Slider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {Undo as UndoIcon} from '@mui/icons-material';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import CustomAlert from '../../components/CustomAlert/CustomAlert.js';
import {Delete as DeleteIcon} from '@mui/icons-material';

function ViewMedicalRecord()
{
    const navigate = useNavigate();
    const param = useParams();
    const [medicalRecord, setMedicalRecord] = useState([]);
    const token = sessionStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const handleOpenConfirmDialog = () => setConfirmDialog(true);
    const handleCloseConfirmDialog = () => setConfirmDialog(false);

    useEffect(() => {
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
                navigate(`/patients/${param.uuid_patient}`);
            }, 5000); 
        }
    }, [alert]);

    useEffect(() => {
        fetchMedicalRecord();
    },[])


    const fetchMedicalRecord = () => {
        axios.get(`http://localhost:3001/patient-medical-record/med-record/${param.uuid_patient}/${param.id_medical_record}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setMedicalRecord(response.data[0]);
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

    const deleteMedicalRecord = () => {
        axios.put(`http://localhost:3001/patient-medical-record/delete/${param.id_medical_record}`,{},
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                handleCloseConfirmDialog();
                setAlert({
                    severity: 'success',
                    text: 'Fișa medicală a fost ștearsă cu succes'
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
                <Grid container className='view-medical-record'>
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
                                <Typography sx={{textAlign: 'center', fontSize: '25px'}} pt={3}>CONSULTAȚIE</Typography>
                                <Typography sx={{textAlign: 'center', fontSize: '18px'}} pt={1} pb={2}>din data: {medicalRecord.date}</Typography>
                                <Grid item xs={12} py={2}>
                                    <Typography className='title'>Leziuni</Typography>
                                    <Box className='box-lesion'>
                                        <Typography className='name'>Comedoane: </Typography> 
                                        <TextField 
                                            variant='standard'
                                            value={medicalRecord.comedones}
                                            sx={{
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                  WebkitTextFillColor: '#003285',
                                                },
                                                width: '100%',
                                            }}
                                            disabled
                                        />
                                    </Box>
                                    <Box className='box-lesion'>
                                        <Typography className='name'>Papule: </Typography> 
                                        <TextField 
                                            variant='standard'
                                            value={medicalRecord.papules}
                                            sx={{
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                  WebkitTextFillColor: '#003285',
                                                },
                                                width: '100%',
                                            }}
                                            disabled
                                        />
                                    </Box>
                                    <Box className='box-lesion'>
                                        <Typography className='name'>Pustule: </Typography> 
                                        <TextField 
                                            variant='standard'
                                            value={medicalRecord.pustules}
                                            sx={{
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                  WebkitTextFillColor: '#003285',
                                                },
                                                width: '100%',
                                            }}
                                            disabled
                                        />
                                    </Box>
                                    <Box className='box-lesion'>
                                        <Typography className='name'>Noduli: </Typography> 
                                        <TextField 
                                            variant='standard'
                                            value={medicalRecord.nodules}
                                            sx={{
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                  WebkitTextFillColor: '#003285',
                                                },
                                                width: '100%',
                                            }}
                                            disabled
                                        />
                                    </Box>
                                    <Box className='box-lesion'>
                                        <Typography className='name'>Chisturi: </Typography> 
                                        <TextField 
                                            variant='standard'
                                            value={medicalRecord.cysts}
                                            sx={{
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                  WebkitTextFillColor: '#003285',
                                                },
                                                width: '100%',
                                            }}
                                            disabled
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Zone afectate</Typography>
                                    <TextField 
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                              WebkitTextFillColor: '#003285',
                                            },
                                            width: '100%',
                                        }}
                                        value={medicalRecord.affected_areas}
                                        variant='standard'
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Modificări observate</Typography>
                                    <TextField 
                                        value={medicalRecord.observed_changes}
                                        variant='standard'
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                              WebkitTextFillColor: '#003285',
                                            },
                                            width: '100%',
                                        }}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Reacții adverse raportate</Typography>
                                    <TextField 
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                              WebkitTextFillColor: '#003285',
                                            },
                                            width: '100%',
                                        }}
                                        value={medicalRecord.adverse_reactions}
                                        variant='standard'
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Nivelul de durere/discomfort (scala 1-10)</Typography>
                                    <Box px={10}>
                                        <Slider
                                            value={medicalRecord.discomfort_level}
                                            step={1}
                                            marks={discomfort_level}
                                            min={1}
                                            max={10}
                                            disabled
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography pb={2} className='title'>Impactul asupra calității vieții (scala 1-10)</Typography>
                                    <Box px={10}>
                                        <Slider
                                            value={medicalRecord.quality_life_level}
                                            step={1}
                                            marks={quality_life_level}
                                            min={1}
                                            max={10}
                                            disabled
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography className='title'>Observații suplimentare (medic)</Typography>
                                    <TextField 
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                              WebkitTextFillColor: '#003285',
                                            },
                                            width: '100%',
                                        }}
                                        value={medicalRecord.doctor_observations}
                                        variant='standard'
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography className='title'>Observațiile pacientului</Typography>
                                    <TextField 
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                              WebkitTextFillColor: '#003285',
                                            },
                                            width: '100%',
                                        }}
                                        value={medicalRecord.patient_observations}
                                        variant='standard'
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Typography className='title'>Recomandări</Typography>
                                    <TextField 
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                              WebkitTextFillColor: '#003285',
                                            },
                                            width: '100%',
                                        }}
                                        value={medicalRecord.recommendation}
                                        variant='standard'
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} className='grid-button' pt={2} pb={2}>
                                    {!disabled && <Button variant='outlined' className='delete-button' startIcon={<DeleteIcon sx={{color: '#F52A2A'}}/>} onClick={handleOpenConfirmDialog}>ȘTERGE</Button>}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Dialog open={confirmDialog} onClose={handleCloseConfirmDialog}>
                        <DialogTitle>Confirmare Ștergere</DialogTitle>
                        <DialogContent >
                            <DialogContentText>
                                Sunteți sigur că doriți să ștergeți fișa medicală?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions >
                            <Button onClick={handleCloseConfirmDialog} variant='outlined'>ANULEAZĂ</Button>
                            <Button onClick={() => deleteMedicalRecord()} sx={{color: '#F52A2A'}}>ȘTERGE</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            )
        }
        </>
    );
}

export default ViewMedicalRecord;