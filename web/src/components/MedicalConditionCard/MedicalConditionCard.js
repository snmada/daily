import React, {useState, useEffect} from 'react';
import './MedicalConditionCard.scss';
import {Grid, Typography, Button, Box, IconButton, TextField, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import {Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon, Edit as EditIcon, Add as AddIcon} from '@mui/icons-material';

function MedicalConditionCard({alert, setAlert})
{
    const param = useParams();
    const token = sessionStorage.getItem('token');
    const [medicalConditions, setMedicalConditions] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [addMode, setAddMode] = useState(false);
    const [newCondition, setNewCondition] = useState({ name: '', treatment: '' });
    const [idMedicalCondition, setIdMedicalCondition] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmDialog, setConfirmDialog] = useState(false);
    const handleOpenConfirmDialog = () => setConfirmDialog(true);
    const handleCloseConfirmDialog = () => setConfirmDialog(false);

    const handleChange = (event) => setNewCondition({...newCondition,  [event.target.name]: event.target.value});

    const updateConditionValue = (index, key, value) => {
        const updatedConditions = [...medicalConditions];
        updatedConditions[index][key] = value;
        setMedicalConditions(updatedConditions);
    };

    useEffect(() => {
        fetchMedicalCondition();
    }, []);

    useEffect(() => {
        setErrorMessage('');
    }, [addMode, editIndex]);

    const fetchMedicalCondition = () => {
        axios.get(`http://localhost:3001/patient-profile/medical-condition/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setMedicalConditions(response.data);
            }
        })
        .catch((error) => {
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    }

    const updateMedicalCondition = (id, name, treatment) => {
        if(!name.trim() || !treatment.trim()) 
        {
            setErrorMessage('Vă rugăm să completați ambele câmpuri');
            return;
        }

        axios.put('http://localhost:3001/patient-profile/update-medical-condition', {
            id, name, treatment
        },
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setEditIndex(null);
            }
        })
        .catch((error) => {
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    }

    const addMedicalCondition =  () => {
        if(!newCondition.name.trim() || !newCondition.treatment.trim()) 
        {
            setErrorMessage('Vă rugăm să completați ambele câmpuri');
            return;
        }

        axios.post('http://localhost:3001/patient-profile/add-medical-condition', {
            uuid_patient: param.uuid_patient,
            name: newCondition.name,
            treatment: newCondition.treatment
        },
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
               fetchMedicalCondition();
               setAddMode(false);
               setNewCondition({name: '',  treatment: ''});
            }
        })
        .catch((error) => { 
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    };

    const deleteMedicalCondition = () => {
        axios.put(`http://localhost:3001/patient-profile/delete-medical-condition/${idMedicalCondition}`,{},
        {
            headers:{
                'authorization': `Bearer ${token}` 
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                fetchMedicalCondition();
                handleCloseConfirmDialog();
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
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
            }, 5000); 
        }
    }, [alert]);

    return(
        <Grid container className='container-medical-condition'>
            <Grid item xs={12}>
                {
                    medicalConditions.length !== 0 && (
                        medicalConditions.map((condition, index) => (
                            <Grid container key={index} pt={2}>
                                {
                                    editIndex === index?
                                    (
                                        <>
                                            <Grid item xs={10} pb={2}>
                                                <TextField
                                                    name='name'
                                                    label='Afecțiune'
                                                    defaultValue={condition.name}
                                                    value={medicalConditions[index].name}
                                                    onChange={(event) => updateConditionValue(index, 'name', event.target.value)}
                                                    fullWidth
                                                
                                                />
                                                <Box sx={{display: 'flex'}} pt={3}>
                                                    <SubdirectoryArrowRightIcon sx={{color: '#61677A'}}/>
                                                    <TextField
                                                        name='treatment'
                                                        label='Tratament'
                                                        defaultValue={condition.treatment}
                                                        value={medicalConditions[index].treatment} 
                                                        onChange={(event) => updateConditionValue(index, 'treatment', event.target.value)}
                                                        fullWidth
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={2} className='grid-button'>
                                                <IconButton onClick={() => {updateMedicalCondition(condition.id_medical_condition, condition.name, condition.treatment)}}><CheckIcon/></IconButton>
                                                <IconButton onClick={() => {setEditIndex(null)}}><CloseIcon/></IconButton>
                                            </Grid>
                                            <Typography className='error'>{errorMessage}</Typography>
                                        </>
                                    )
                                    :
                                    (
                                        medicalConditions.length !== 0 &&
                                        <Grid container pb={3}>
                                            <Grid item xs={10}>
                                                <Typography py={1}><span style={{background: '#e3f6fe', padding: '5px'}}>Afecțiune:</span> {condition.name}</Typography>
                                                <Box style={{display: 'flex'}}>
                                                    <SubdirectoryArrowRightIcon sx={{color: '#61677A'}}/>
                                                    <Typography>Tratament: {condition.treatment}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={2} className='grid-button'>
                                                <IconButton onClick={() => {setEditIndex(index); setAddMode(false)}}><EditIcon/></IconButton>
                                                <IconButton onClick={() => {handleOpenConfirmDialog(); setIdMedicalCondition(condition.id_medical_condition)}}><DeleteIcon/></IconButton>
                                            </Grid>
                                        </Grid>
                                    )
                                }
                            </Grid>
                        ))
                    )
                }
                {
                    (!addMode && medicalConditions.length === 0) && 
                    <Box className='no-data-box'>
                        <Typography sx={{color: '#61677A'}} pb={2}>Nu există afecțiuni medicale</Typography>
                        <Tooltip title={<h2>Adaugă afecțiuni medicale</h2>}>
                            <IconButton className='add-icon-button' onClick={() => {setAddMode(true)}}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>  
                    </Box>
                }
                {
                    addMode && (
                        <>
                        <Grid container pt={2}>
                            <Grid item xs={10} pb={2}>
                                <TextField
                                    name='name'
                                    label='Afecțiune'
                                    value={newCondition.name} 
                                    onChange={handleChange} 
                                    fullWidth
                                />
                                <Box style={{display: 'flex'}} pt={3}>
                                    <SubdirectoryArrowRightIcon sx={{color: '#61677A'}}/>
                                    <TextField
                                        name='treatment'
                                        label='Tratament'
                                        value={newCondition.treatment}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={2} className='grid-button'>
                                <IconButton onClick={() => {addMedicalCondition()}}><CheckIcon/></IconButton>
                                <IconButton onClick={() => {setAddMode(false); setNewCondition({name: '',  treatment: ''})}}><CloseIcon/></IconButton>
                            </Grid>
                            <Typography className='error'>{errorMessage}</Typography>
                        </Grid>
                        </>
                    )
                }
                {
                    (!addMode && medicalConditions.length > 0) && <Button className='add-button' onClick={() => {setAddMode(true); setEditIndex(null)}}>+ ADAUGĂ</Button>
                }
            </Grid>
            <Dialog open={confirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirmare Ștergere</DialogTitle>
                <DialogContent >
                    <DialogContentText>
                        Sunteți sigur că doriți să ștergeți afecțiunea medicală selectată?
                    </DialogContentText>
                </DialogContent>
                <DialogActions >
                    <Button onClick={handleCloseConfirmDialog} variant='outlined'>ANULEAZĂ</Button>
                    <Button  onClick={() => deleteMedicalCondition()} sx={{color: '#F52A2A'}}>ȘTERGE</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default MedicalConditionCard;