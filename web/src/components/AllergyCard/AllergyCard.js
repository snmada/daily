import React, {useState, useEffect} from 'react';
import './AllergyCard.scss';
import {Grid, Typography, Button, Box, IconButton, TextField, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon, Add as AddIcon} from '@mui/icons-material';
import axios from 'axios';
import {useParams} from 'react-router-dom';

function AllergyCard({alert, setAlert})
{
    const token = sessionStorage.getItem('token');
    const param = useParams();
    const [patientAllergies, setPatientAllergies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const handleAddAllergy = () => setIsEditing(true);
    const [idAllergy, setIdAllergy] = useState('');
    const [confirmDialog, setConfirmDialog] = useState(false);
    const handleOpenConfirmDialog = () => setConfirmDialog(true);
    const handleCloseConfirmDialog = () => setConfirmDialog(false);

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
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    }

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
                setAlert({
                    severity: 'error',
                    text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
                });
            });
        }
    }

    const deleteAllergy = () => {
        axios.put(`http://localhost:3001/patient-profile/delete-allergy/${idAllergy}`,{},
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                fetchPatientAllergies();
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
        fetchPatientAllergies();
    }, []);

    useEffect(() => {
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
            }, 5000); 
        }
    }, [alert]);

    return(
        <Grid container className='container-allergies'>
            <Grid item xs={12}>
                <Typography className='title'>Alergii</Typography>
                <Box className='allergies-box'>
                    {
                        patientAllergies.length !== 0? 
                        (
                            patientAllergies.map((allergy, index) => (
                                <Box key={index} className='allergy-item'>
                                    <Box flexGrow={1}>{allergy.type}</Box>
                                    <IconButton onClick={() => {handleOpenConfirmDialog(); setIdAllergy(allergy.id_allergy)}}><DeleteIcon className='delete-icon'/></IconButton>
                                </Box>
                            ))
                        )
                        :
                        (
                            !isEditing && 
                            <Box className='no-data-box'>
                                <Typography sx={{color: '#61677A'}} pb={2}>Nu există alergii</Typography>
                                <Tooltip title={<h2>Adaugă</h2>}>
                                    <IconButton className='add-icon-button' onClick={handleAddAllergy}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip> 
                            </Box>
                        )
                    }
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
                        patientAllergies.length !== 0 && <Button className='add-button' onClick={handleAddAllergy}>+ ADAUGĂ</Button>
                    )
                }
            </Grid>
            <Dialog open={confirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirmare Ștergere</DialogTitle>
                <DialogContent >
                    <DialogContentText>
                        Sunteți sigur că doriți să ștergeți tipul de alergie selectat?
                    </DialogContentText>
                </DialogContent>
                <DialogActions >
                    <Button onClick={handleCloseConfirmDialog} variant='outlined'>ANULEAZĂ</Button>
                    <Button  onClick={() => deleteAllergy()} sx={{color: '#F52A2A'}}>ȘTERGE</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default AllergyCard;