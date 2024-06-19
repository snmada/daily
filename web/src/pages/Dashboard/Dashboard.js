import React, {useEffect, useState} from 'react';
import {Grid, Typography, Stepper, Step, StepLabel, Box, Skeleton} from '@mui/material';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import './Dashboard.scss';
import {jwtDecode} from 'jwt-decode';
import greetingImg from '../../images/undraw_lightbulb_moment_re_ulyo.svg';
import cardImg from '../../images/card-image.svg';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import 'dayjs/locale/ro';
import Groups2Icon from '@mui/icons-material/Groups2';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import {PieChart} from '@mui/x-charts/PieChart';
import {BarChart} from '@mui/x-charts/BarChart';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Dashboard()
{
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const decodedToken = jwtDecode(sessionStorage.getItem('token'));
    const [name, setName] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().getHours());
    const [greeting, setGreeting] = useState('');
    const [data, setData] = useState({
        totalPatients: 0, averageAge: 0, totalFemale: 0, totalMale: 0, totalFRosacea: 0, totalFVulgaris: 0, totalFJuvenile: 0, totalFCystic: 0, 
        totalMRosacea: 0, totalMVulgaris: 0, totalMJuvenile: 0, totalMCystic: 0, totalRosacea: 0, totalVulgaris: 0, totalJuvenile: 0, totalCystic: 0
    });
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [totalMR, setTotalMR] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setName(decodedToken.firstname + ' ' + decodedToken.lastname);
    }, []);

    const updateGreeting = () => {
        if(currentTime < 12) 
        {
            setGreeting('Bună dimineața');
        } 
        else if(currentTime < 18) 
        {
            setGreeting('Bună ziua');
        } 
        else 
        {
            setGreeting('Bună seara');
        }
    };

    useEffect(() => {
        updateGreeting();
        const interval = setInterval(() => {
            setCurrentTime(new Date().getHours());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const dataset = [
        {
            female: data.totalFRosacea,
            male: data.totalMRosacea,
            acne_type: 'Rozacee'
        },
        {
            female: data.totalFVulgaris,
            male: data.totalMVulgaris,
            acne_type: 'Vulgară'
        },
        {
            female: data.totalFJuvenile,
            male: data.totalMJuvenile,
            acne_type: 'Juvenilă'
        },
        {
            female: data.totalFCystic,
            male: data.totalMCystic,
            acne_type: 'Chistică'
        }
    ];

    useEffect(() => {
        fetchData();
        fetchMedicalRecords();
    }, [])

    const fetchData = () => {
        axios.get(`http://localhost:3001/dashboard/data/${decodedToken.uuid_doctor}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setData(response.data);
            }
        })
        .catch((error) => {
            (error.response.status === 500) && alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    const fetchMedicalRecords = () => {
        axios.get(`http://localhost:3001/dashboard/medical-records/${decodedToken.uuid_doctor}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setTotalMR(response.data.length);
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

                if(medRecords.length >= 5)
                {
                    medRecords = medRecords.slice(0, 5);
                }

                setMedicalRecords(medRecords);
                setIsLoading(false);
            }
        })
        .catch((error) => {
            (error.response.status === 500) && alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    return(
        <Grid container className='dashboard'>
            <SideBar/>
            <Grid item className='main-content'>
                <NavBar title=''/>
                <Grid container spacing={2} mt={1} mb={0}>
                    <Grid item xs={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container className='greeting-container'>
                                    <Grid item xs={8} className='greeting-grid'>
                                        <h1>{greeting}, {name}!</h1>
                                        <p>O altă zi, o altă oportunitate de a schimba vieți!</p>
                                    </Grid>
                                    <Grid item xs={4} className='grid-image'>
                                        <img src={greetingImg} width='250px' height='250px' alt='Greeting Image' className='greeting-image'/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} className='patient-card'>
                                <Grid container className='card'>
                                    <div className='div-image'>
                                        <img className='card-image' src={cardImg} alt='SVG Image'/>
                                    </div>
                                    <Grid container className='card-container'>
                                        <Grid item xs={3} className='card-icon'>
                                            <Groups2Icon className='icon'/>
                                        </Grid>
                                        <Grid item xs={12}><h2>Pacienți</h2></Grid>
                                        <Grid item xs={12}><h1>{!data.totalPatients? '0' : data.totalPatients}</h1></Grid> 
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} className='consultation-card'>
                                <Grid container className='card'>
                                    <div className='div-image'>
                                        <img className='card-image' src={cardImg} alt='SVG Image'/>
                                    </div>
                                    <Grid container className='card-container'>
                                        <Grid item xs={3} className='card-icon'>
                                            <ContentPasteIcon className='icon'/>
                                        </Grid>
                                        <Grid item xs={12}><h2>Consultații</h2></Grid>
                                        <Grid item xs={12}><h1>{totalMR}</h1></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} className='age-card'>
                                <Grid container className='card'>
                                    <div className='div-image'>
                                        <img className='card-image' src={cardImg} alt='SVG Image'/>
                                    </div>
                                    <Grid container className='card-container'>
                                        <Grid item xs={3} className='card-icon'>
                                            <AccessibilityNewIcon className='icon'/>
                                        </Grid>
                                        <Grid item xs={12}><h2>Vârsta medie</h2></Grid>
                                        <Grid item xs={12}><h1>{!data.averageAge? '-' : data.averageAge}</h1></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container className='chart-container'>
                                    {data.totalPatients?
                                        (
                                            <>
                                            <Grid item xs={6} className='pie-chart'>
                                                <Typography py={2} fontSize={'18px'}>Distribuția pacienților în funcție de sexul acestora</Typography>
                                                <PieChart
                                                    series={[
                                                        {data: [
                                                            {id: 0, value: data.totalFemale, label: 'Feminin', color: '#E1AFD1'},
                                                            {id: 1, value: data.totalMale, label: 'Masculin', color: '#6AD4DD'}]
                                                        }
                                                    ]}
                                                    width={400}
                                                    height={220}
                                                />
                                            </Grid>
                                            <Grid item xs={6} className='pie-chart'>
                                                <Typography py={2} fontSize={'18px'}>Distribuția pacienților în funcție de tipul de acnee</Typography>
                                                <PieChart
                                                    series={[
                                                        {data: [
                                                            {id: 0, value: data.totalRosacea, label: 'Rozacee', color: '#D2E0FB'},
                                                            {id: 1, value: data.totalVulgaris, label: 'Vulgară', color: '#FFDBAA'},
                                                            {id: 2, value: data.totalJuvenile, label: 'Juvenilă', color: '#B0D9B1'},
                                                            {id: 3, value: data.totalCystic, label: 'Chistică', color: '#8EACCD'}]
                                                        }
                                                    ]}
                                                    width={400}
                                                    height={220}
                                                />
                                            </Grid>
                                            <Grid item xs={12} py={6} className='bar-chart'>
                                                <Typography fontSize={'18px'}>Distribuția pacienților după sexul acestora pentru fiecare tip de acnee</Typography>
                                                <BarChart
                                                    dataset={dataset}
                                                    series={[
                                                        {dataKey: 'female', label: 'Feminin', color: '#E1AFD1'},
                                                        {dataKey: 'male', label: 'Masculin', color: '#6AD4DD'},
                                                    ]}
                                                    height={400}
                                                    xAxis={[{dataKey: 'acne_type', scaleType: 'band'}]}
                                                    margin={{top: 110, bottom: 30, left: 40, right: 10}}
                                                />
                                            </Grid>
                                            </>
                                        )
                                        :
                                        (
                                            <Grid item xs={12}>
                                                <Typography sx={{textAlign: 'center', padding: '50px'}}>Lipsă date</Typography>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className='calendar-grid'>
                                    <LocalizationProvider adapterLocale='ro' dateAdapter={AdapterDayjs}>
                                        <DateCalendar/>
                                    </LocalizationProvider>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className='div-consultation'>
                                    <Typography pb={3}>Consultații recente</Typography>
                                    <Stepper orientation='vertical'>
                                        {
                                            !isLoading? 
                                            (
                                                medicalRecords.length !== 0? 
                                                (
                                                    medicalRecords.map((medicalRecord, index) => (
                                                        <Step key={index} >
                                                            <StepLabel StepIconComponent={ContentPasteIcon} onClick={() => navigate(`/patients/${medicalRecord.uuid_patient}/view-medical-record/${medicalRecord.id_medical_record}`)}>
                                                                <Grid container sx={{cursor: 'pointer'}}>
                                                                    <Grid item xs={10}>
                                                                        <Typography>Data: {medicalRecord.created_on}</Typography>
                                                                        <Typography>Pacient: {medicalRecord.lastname} {medicalRecord.firstname}</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </StepLabel>
                                                        </Step>
                                                    ))
                                                ) 
                                                : 
                                                (
                                                    <Box className='no-data-box'>
                                                        <Typography sx={{color: '#61677A'}} pb={2}>Nu există consultații recente</Typography>
                                                    </Box>
                                                )
                                            )
                                            :
                                            (
                                                <>
                                                    <Skeleton animation='wave'/>
                                                    <Skeleton width={250}/>
                                                </>
                                            )
                                        }
                                    </Stepper>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Dashboard;