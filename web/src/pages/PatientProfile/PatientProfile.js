import React, {useState} from 'react';
import './PatientProfile.scss';
import {Grid, Typography, Button, Box, IconButton, TextField, Tab, Stepper, Step, StepLabel} from '@mui/material';
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


function PatientProfile()
{
    const [patientInfo, setPatientInfo] = useState({
        lastname: 'Doe',
        firstname: 'John',
        CNP: '1901218000000',
        phone: '0712345678',
        address: 'Cluj-Napoca',
        country: 'România',
        age: 23,
        gender: 'M',
        height: 170,
        weight: 54
    });

    const [patientAllergies, setPatientAllergies] = useState(['Soia', 'Lactoză', 'Zmeură', 'Ambrozie', 'Penicilină']);

    const [patientConsultations, setPatientConsultations] = useState([
        {date: '23-10-2021'},
        {date: '22-09-2021'},
        {date: '19-08-2021'}
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const handleAddAllergy = () => setIsEditing(true);
    const handleSaveAllergy = () => setIsEditing(false);

    const [tabValue, setTabValue] = useState('1');
    const handleChangeTabValue = (event, newValue) => setTabValue(newValue);

    return(
        <Grid container className='patient-profile'>
            <SideBar/>
            <Grid item className='main-content'>
                <NavBar title='Patient Profile'/>
                <Grid item xs={12} className='grid-item-path'>
                    <Typography className='path'>
                        Pacienți <ArrowForwardIosIcon className='arrow-icon'/>{patientInfo.lastname.toUpperCase()} {patientInfo.firstname}
                    </Typography>
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
                                        <IconButton><ModeEditOutlineIcon/></IconButton>
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
                                                    (
                                                        <Typography>Feminin</Typography>
                                                    ):(
                                                        <Typography>Masculin</Typography>
                                                    )
                                                }
                                            </Grid>
                                                                            
                                            <Grid item xs={6} pt={3}>
                                                <Typography>Greutate</Typography>
                                                <Typography>{patientInfo.weight} kg</Typography>
                                            </Grid>
                                                                                
                                            <Grid item xs={6} pt={3}>
                                                <Typography>Înălțime</Typography>
                                                <Typography>{patientInfo.height} cm</Typography>
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
                                            <Box flexGrow={1}>{allergy}</Box>
                                            <IconButton><DeleteIcon className='delete-icon'/></IconButton>
                                        </Box>
                                    ))}
                                </Box>
                                {
                                    isEditing? 
                                    (
                                        <Box className='edit-box'>
                                            <TextField
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
                                                <Tab label='Istoric medical' value='2'/>
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
                                    
                                        <TabPanel value='2'>Istoric Medical</TabPanel>
                                    </TabContext>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default PatientProfile;