import React, {useState, useEffect} from 'react';
import './PatientProfile.scss';
import {Grid, Typography, Button, Box, Tab, Stepper, Step, StepLabel, Tooltip, IconButton} from '@mui/material';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {ContentPaste as ContentPasteIcon, Add as AddIcon} from '@mui/icons-material';
import {useParams} from 'react-router-dom';
import EmailSender from '../../components/EmailSender/EmailSender.js';
import PatientInfoCard from '../../components/PatientInfoCard/PatientInfoCard.js';
import AllergyCard from '../../components/AllergyCard/AllergyCard.js';
import TreatmentCard from '../../components/TreatmentCard/TreatmentCard.js';
import MedicalConditionCard from '../../components/MedicalConditionCard/MedicalConditionCard.js';
import CustomAlert from '../../components/CustomAlert/CustomAlert.js';
import axios from 'axios';
import Gallery from '../../components/Gallery/Gallery.js';
import {useNavigate} from 'react-router-dom';

function PatientProfile()
{
    const token = sessionStorage.getItem('token');
    const param = useParams();
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [tabValue, setTabValue] = useState('1');
    const handleChangeTabValue = (event, newValue) => setTabValue(newValue);
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMedicalRecord();
    },[]);

    const fetchMedicalRecord = () => {
        axios.get(`http://localhost:3001/patient-medical-record/data/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                let medRecords = response.data;

                medRecords.sort((a, b) => {
                    const dateA = new Date(a.created_on);
                    const dateB = new Date(b.created_on);

                    if(dateA > dateB) return -1;
                    if(dateA < dateB) return 1;

                    if(a.id_medical_record > b.id_medical_record) return -1;
                    if(a.id_medical_record < b.id_medical_record) return 1;

                    return 0;
                });

                setMedicalRecords(medRecords);
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
                <></>
            )
            :
            (
                <Grid container className='patient-profile'>
                {alert && (<CustomAlert severity={alert.severity} text={alert.text}/>)}
                <SideBar/>
                <Grid item className='main-content'>
                    <NavBar title=''/>
                    <Grid container>
                        <Grid item xs={5}>
                            <PatientInfoCard alert={alert} setAlert={setAlert}/>
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
                                                            medicalRecords.length !== 0 &&  
                                                            <Box className='box'pb={2}>
                                                                <Button onClick={() => navigate(`/patients/${param.uuid_patient}/medical-record`)}>+ CONSULTAȚIE NOUĂ</Button>
                                                            </Box>
                                                        }
                                                        <Stepper orientation='vertical'>
                                                            {
                                                                medicalRecords.length !== 0?
                                                                (
                                                                    medicalRecords.map((medicalRecord, index) => (
                                                                        <Step key={index}>
                                                                            <StepLabel StepIconComponent={ContentPasteIcon}>
                                                                                <Grid container className='container-step' onClick={() => navigate(`/patients/${param.uuid_patient}/view-medical-record/${medicalRecord.id_medical_record}`)}>
                                                                                    <Tooltip title={<h2>Vezi consultație</h2>}>
                                                                                        <Grid item xs={12}>
                                                                                            <Typography>Data: {medicalRecord.date}</Typography>
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
                                                                            <IconButton className='add-icon-button' onClick={() => navigate(`/patients/${param.uuid_patient}/medical-record`)}>
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