import React from 'react';
import {Grid, Typography, AppBar, Box, Toolbar, Button, Paper} from '@mui/material';
import './LandingPage.scss';
import {useNavigate} from 'react-router-dom';
import {
    TaskAlt as TaskAltIcon, 
    Login as LoginIcon, 
    PhoneIphone as PhoneIphoneIcon, 
    Language as LanguageIcon, 
    SwipeUp as SwipeUpIcon
} from '@mui/icons-material';
import image from '../../images/undraw_team_re_0bfe.svg';

function LandingPage()
{
    const navigate = useNavigate();

    return(
        <Grid container className='landing-page'>
            <AppBar className='appbar' elevation={0}>
                <Toolbar>
                    <Typography className='logo'>DAILY</Typography>
                    <Button 
                        variant='outlined' 
                        className='button' 
                        startIcon={<LoginIcon className='login-icon'/>} 
                        onClick={() => navigate('/signin')}
                    >INTRĂ ÎN CONT</Button>
                </Toolbar>
            </AppBar>
            <Grid item xs={12} className='content'>
                <Grid container>
                    <Grid item xs={7} className='left-content'>
                        <Paper className='paper' elevation={0}>
                            <Typography className='title'>SOLUȚIE DIGITALĂ PENTRU</Typography>
                            <Typography className='title'>DERMATOLOGI ȘI PACIENȚI</Typography>
                            <Typography sx={{fontSize: '25px'}} py={2}>Ce oferim?</Typography>
                            <Box className='box-item'>
                                <TaskAltIcon className='task-icon'/>
                                <Typography className='text-item'>
                                    <span className='span'>
                                        Aplicație Web <LanguageIcon className='language-icon'/> pentru medici. Gestionați eficient tratamentele
                                    </span> 
                                    și monitorizați progresul pacienților.
                                </Typography>
                                </Box>
                            <Box className='box-item'>
                                <TaskAltIcon className='task-icon'/>
                                <Typography className='text-item'>
                                    <span className='span'>
                                        Aplicație Mobilă <PhoneIphoneIcon className='language-icon'/> pentru pacienți. Pacienții pot urmări evoluția
                                    </span> 
                                    tratamentului lor în mod simplu și rapid.
                                </Typography>
                            </Box>
                            <Box className='box-register'>
                                <Button variant='contained' className='button-register' onClick={() => navigate('/signup')}>Înregistrează-te</Button>
                                <SwipeUpIcon className='swipe-icon'/>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={5} className='right-content'>
                        <img src={image} className='image'/>
                    </Grid>
                </Grid>
            </Grid>
            <svg 
                className='svg-wave' 
                xmlns='http://www.w3.org/2000/svg' 
                viewBox='0 0 1440 170'>
                    <path 
                        fill='#FFCF81' 
                        fillOpacity='1' 
                        d='M0,64L48,58.7C96,53,192,43,288,42.7C384,43,480,53,576,74.7C672,96,768,128,864,
                            133.3C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,
                            320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,
                            320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'>  
                    </path>
            </svg>
        </Grid>
    );
}

export default LandingPage;