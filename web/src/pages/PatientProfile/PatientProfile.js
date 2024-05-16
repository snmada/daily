import React, {useState, useEffect} from 'react';
import './PatientProfile.scss';
import {Grid, Typography, Button, Box, Tab, Stepper, Step, StepLabel, Tooltip, IconButton, LinearProgress} from '@mui/material';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {ArrowForwardIos as ArrowForwardIosIcon, ContentPaste as ContentPasteIcon, Add as AddIcon} from '@mui/icons-material';
import {useParams} from 'react-router-dom';
import EmailSender from '../../components/EmailSender/EmailSender.js';
import PatientInfoCard from '../../components/PatientInfoCard/PatientInfoCard.js';
import AllergyCard from '../../components/AllergyCard/AllergyCard.js';
import TreatmentCard from '../../components/TreatmentCard/TreatmentCard.js';
import MedicalConditionCard from '../../components/MedicalConditionCard/MedicalConditionCard.js';
import CustomAlert from '../../components/CustomAlert/CustomAlert.js';
import axios from 'axios';
import Gallery from '../../components/Gallery/Gallery.js';

function PatientProfile()
{
    const token = sessionStorage.getItem('token');
    const param = useParams();
    const [patientConsultations, setPatientConsultations] = useState([]);
    const [tabValue, setTabValue] = useState('1');
    const handleChangeTabValue = (event, newValue) => setTabValue(newValue);
    const [alert, setAlert] = useState(null);
    const [patient, setPatient] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPatient();
    },[])

    const fetchPatient = () => {
        axios.get(`http://localhost:3001/patient-profile/patient-info/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setPatient(response.data);
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
                    {alert && (<CustomAlert severity={alert.severity} text={alert.text}/>)}
                    <SideBar/>
                    <Grid item className='main-content'>
                        <NavBar title=''/>
                        <Grid item xs={12} className='grid-item-path'>
                            <Typography className='path'>
                                Pacienți <ArrowForwardIosIcon className='arrow-icon'/> {patient.lastname.toUpperCase()} {patient.firstname}
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={5}>
                                <PatientInfoCard alert={alert} setAlert={setAlert} isLoading={isLoading} setIsLoading={setIsLoading}/>
                            </Grid>
                            <Grid item xs={4}>
                                <TreatmentCard alert={alert} setAlert={setAlert}/>
                            </Grid>
                            <Grid item xs={3}>
                                <AllergyCard alert={alert} setAlert={setAlert}/>
                            </Grid>
                            <Grid item xs={9} pt={3}>
                                <div className='div-tabs'>
                                    <Grid container className='container-tabs'>
                                        <Grid item xs={12}>
                                            <TabContext value={tabValue}>
                                                <Box className='box-tab-list'>
                                                    <TabList onChange={handleChangeTabValue}>
                                                        <Tab label='Consultații' value='1'/>
                                                        <Tab label='Afecțiuni medicale' value='2'/>
                                                        <Tab label='Cod access - Aplicație mobilă' value='3'/>
                                                    </TabList>
                                                </Box>
                                                <TabPanel value='1'>
                                                    <Grid container className='container-tab-panel'>
                                                        <Grid item xs={12}>
                                                            {
                                                                patientConsultations.length !== 0 &&  
                                                                <Box className='box'pb={2}>
                                                                    <Button>+ CONSULTAȚIE NOUĂ</Button>
                                                                </Box>
                                                            }
                                                            <Stepper orientation='vertical'>
                                                                {
                                                                    patientConsultations.length !== 0?
                                                                    (
                                                                        patientConsultations.map((consultation, index) => (
                                                                            <Step key={index}>
                                                                                <StepLabel StepIconComponent={ContentPasteIcon}>
                                                                                    <Grid container className='container-step'>
                                                                                        <Tooltip title={<h2>Vezi consultație</h2>}>
                                                                                            <Grid item xs={12}>
                                                                                                <Typography>Data: {consultation.date}</Typography>
                                                                                            </Grid>
                                                                                        </Tooltip>
                                                                                    </Grid>
                                                                                </StepLabel>
                                                                            </Step>
                                                                        ))
                                                                    )
                                                                    :
                                                                    (
                                                                        <Box className='no-data-box'>
                                                                            <Typography sx={{color: '#61677A'}} pb={2}>Nu există consultații</Typography>
                                                                            <Tooltip title={<h2>Adaugă o consultație</h2>}>
                                                                                <IconButton className='add-icon-button'>
                                                                                    <AddIcon/>
                                                                                </IconButton>
                                                                            </Tooltip>   
                                                                        </Box>
                                                                    )
                                                                }
                                                            </Stepper>
                                                        </Grid>
                                                    </Grid>
                                                </TabPanel>

                                                <TabPanel value='2'>
                                                    <MedicalConditionCard alert={alert} setAlert={setAlert}/>
                                                </TabPanel>
                                            
                                                <TabPanel value='3'>
                                                    <EmailSender uuid_patient={param.uuid_patient}/>
                                                </TabPanel>
                                            </TabContext>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={3} pt={3}>
                                <Gallery/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
        </>
    );
}

export default PatientProfile;