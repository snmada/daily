import React, {useState} from 'react';
import {Grid, Paper, Box, Typography, Stepper, Step, StepLabel} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockIcon from '@mui/icons-material/Lock';
import StepOne from './StepOne.js';
import StepTwo from './StepTwo.js';
import StepThree from './StepThree.js';
import './SignUp.scss';

const initialState = {firstname: '', lastname: '', CNP: '', stampCode: '', email: '', password: '', confirmPassword: ''};

function SignUp() 
{
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [currentStep, setCurrentStep] = useState(0);

    const handleChange = (event) => setFormData({...formData, [event.target.name]: event.target.value});

    const handleNextStep = () => setCurrentStep(currentStep + 1);

    const handlePrevStep = () => setCurrentStep(currentStep - 1);

    const renderForm = () => {
        switch(currentStep)
        {
            case 0:
                return <StepOne formData={formData} handleChange={handleChange} handleNextStep={handleNextStep}/>;
            case 1:
                return <StepTwo formData={formData} handleChange={handleChange} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep}/>;
            case 2:
                return <StepThree formData={formData} handleChange={handleChange} handlePrevStep={handlePrevStep}/>;
        }
    };

    const iconSteps = [
        <PersonIcon className='icon-step'/>,
        <AssignmentIndIcon className='icon-step'/>,
        <LockIcon className='icon-step'/>
    ];

    return (
        <div className='signup'>
            <Grid container className='grid-container'>
                <Grid item>
                    <Paper className='paper'>
                        <Box className='box-title'>
                            <Typography className='typography-title' onClick={() => navigate('/')}>DAILY</Typography>
                        </Box>
                        <Box pt={1} pb={3}>
                            <Stepper activeStep={currentStep} alternativeLabel>
                                {iconSteps.map((label, index) => (
                                    <Step key={index}
                                        sx={{
                                            '& .MuiStepLabel-root .Mui-completed': {
                                                color: '#8EC3B2', 
                                            },
                                            '& .MuiStepLabel-root .Mui-active': {
                                                color: '#F9D97D', 
                                            },
                                            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                                fill: '#191919', 
                                            },
                                        }}
                                    >
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                        {renderForm()}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default SignUp;