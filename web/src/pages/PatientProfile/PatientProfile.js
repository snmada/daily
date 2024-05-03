import React, {useState} from 'react';
import './PatientProfile.scss';
import {Grid, Typography, Button, Box, Tab, Stepper, Step, StepLabel} from '@mui/material';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {ArrowForwardIos as ArrowForwardIosIcon, ContentPaste as ContentPasteIcon} from '@mui/icons-material';
import {useParams, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import EmailSender from '../../components/EmailSender/EmailSender.js';
import PatientInfoCard from '../../components/PatientInfoCard/PatientInfoCard.js';
import AllergyCard from '../../components/AllergyCard/AllergyCard.js';
import TreatmentCard from '../../components/TreatmentCard/TreatmentCard.js';

function PatientProfile()
{
    const navigate = useNavigate();
    const decoded_token_patient = jwtDecode(sessionStorage.getItem('token_patient'));
    const param = useParams();
    const [patientConsultations, setPatientConsultations] = useState([
        {date: '23-10-2021'},
        {date: '22-09-2021'},
        {date: '19-08-2021'}
    ]);
    const [tabValue, setTabValue] = useState('1');
    const handleChangeTabValue = (event, newValue) => setTabValue(newValue);

    return(
        <Grid container className='patient-profile'>
            <SideBar/>
            <Grid item className='main-content'>
                <NavBar title='Patient Profile'/>
                <Grid item xs={12} className='grid-item-path'>
                    <Typography className='path'>
                        Pacienți <ArrowForwardIosIcon className='arrow-icon'/>{decoded_token_patient.lastname.toUpperCase()} {decoded_token_patient.firstname}
                    </Typography>
                    <Button variant='contained' onClick={() => navigate(`/skin-data/${param.uuid_patient}`)}>Fișă pacient</Button>
                </Grid>
                <Grid container>
                    <Grid item xs={5}>
                        <PatientInfoCard/>
                    </Grid>
                    <Grid item xs={4}>
                        <TreatmentCard/>
                    </Grid>
                    <Grid item xs={3}>
                        <AllergyCard/>
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
        </Grid>
    );
}

export default PatientProfile;