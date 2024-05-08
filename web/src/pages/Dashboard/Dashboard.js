import React, {useEffect, useState} from 'react';
import {Grid, Typography, Stepper, Step, StepLabel} from '@mui/material';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import './Dashboard.scss';
import {jwtDecode} from 'jwt-decode';
import greetingImg from '../../images/undraw_team_re_0bfe.svg';
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

function Dashboard()
{
    const [name, setName] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().getHours());
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const decodedToken = jwtDecode(sessionStorage.getItem('token'));
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

    const [patientConsultations, setPatientConsultations] = useState([
        {date: '23-10-2021'},
        {date: '22-09-2021'},
        {date: '19-08-2021'}
    ]);

    const dataset = [
        {
            female: 20,
            male: 30,
            acne_type: 'Rozacee'
        },
        {
            female: 20,
            male: 30,
            acne_type: 'Vulgară'
        },
        {
            female: 20,
            male: 30,
            acne_type: 'Juvenilă'
        },
        {
            female: 20,
            male: 30,
            acne_type: 'Chistică'
        }
    ];

    return(
        <Grid container className='dashboard'>
            <SideBar/>
            <Grid item className='main-content'>
                <NavBar title=''/>
                <Grid container spacing={2} mt={1} mb={30}>
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
                                        <Grid item xs={12}><h1>250</h1></Grid> 
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
                                        <Grid item xs={12}><h1>123</h1></Grid>
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
                                        <Grid item xs={12}><h1>23</h1></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container className='chart-container'>
                                    <Grid item xs={6} className='pie-chart'>
                                        <Typography py={2} fontSize={'18px'}>Distribuția pacienților</Typography>
                                        <PieChart
                                            series={[
                                                {data: [
                                                    {id: 0, value: 10, label: 'Feminin', color: '#E1AFD1'},
                                                    {id: 1, value: 15, label: 'Masculin', color: '#6AD4DD'}]
                                                }
                                            ]}
                                            width={400}
                                            height={220}
                                        />
                                    </Grid>
                                    <Grid item xs={6} className='pie-chart'>
                                        <Typography py={2} fontSize={'18px'}>Distribuția pacienților</Typography>
                                        <PieChart
                                            series={[
                                                {data: [
                                                    {id: 0, value: 10, label: 'Feminin', color: '#E1AFD1'},
                                                    {id: 1, value: 15, label: 'Masculin', color: '#6AD4DD'}]
                                                }
                                            ]}
                                            width={400}
                                            height={220}
                                        />
                                    </Grid>
                                    <Grid item xs={12} py={10} className='bar-chart'>
                                        <Typography  fontSize={'18px'}>Distribuția pacienților</Typography>
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
                                        {patientConsultations.map((consultation, index) => (
                                            <Step key={index}>
                                                <StepLabel StepIconComponent={ContentPasteIcon}>
                                                    <Grid container>
                                                        <Grid item xs={10}>
                                                            <Typography>Data: {consultation.date}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </StepLabel>
                                            </Step>
                                        ))}
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