import React, {useState, useEffect} from 'react';
import './AllergyCard.scss';
import {Grid, Typography, Button, Box, IconButton, TextField} from '@mui/material';
import {Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon} from '@mui/icons-material';
import axios from 'axios';
import {useParams} from 'react-router-dom';

function AllergyCard()
{
    const token = sessionStorage.getItem('token');
    const param = useParams();
    const [patientAllergies, setPatientAllergies] = useState([{}]);
    const [isEditing, setIsEditing] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const handleAddAllergy = () => setIsEditing(true);

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

    useEffect(() => {
        fetchPatientAllergies();
    }, []);

    return(
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
    );
}

export default AllergyCard;