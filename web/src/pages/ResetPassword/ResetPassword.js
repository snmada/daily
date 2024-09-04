import React, {useState, useEffect} from 'react';
import {Grid, Paper, Box, Typography, TextField, IconButton, InputAdornment, Alert} from '@mui/material';
import {Visibility, VisibilityOff, VerifiedUser} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import './ResetPassword.scss';
import axios from 'axios';

function ResetPassword()
{
    const navigate = useNavigate();
    const [changed, setChanged] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [successMessage, setSuccesMessage] = useState('');
    const [stepOne, setStepOne] = useState(true);
    const [stepTwo, setStepTwo] = useState(false);
    const [stepThree, setStepThree] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const [email, setEmail] = useState('');
    const [passwordFormData, setPasswordFormData] = useState({password: '', confirmPassword: ''});
    const handleChangePassword = (event) => setPasswordFormData({...passwordFormData, [event.target.name]: event.target.value});

    const schemaEmail = yup.object().shape({
        email: yup.string().required('Câmp obligatoriu').email('Adresă de email invalidă'),
    });
    const {register: registerEmail, handleSubmit: handleSubmitEmail, formState: {errors: emailErrors}} = useForm({
        resolver: yupResolver(schemaEmail),
    });

    const schemaPassword = yup.object().shape({
        password: yup.string().required('Câmp obligatoriu').password(),
        confirmPassword: yup.string().required('Câmp obligatoriu').oneOf([yup.ref('password'), null], 'Parolele introduse nu coincid')
    });
    const {register: registerPassword, handleSubmit: handleSubmitPassword, formState: {errors: passwordErrors}} = useForm({
        resolver: yupResolver(schemaPassword),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const onSubmitEmail = () => {
        axios.post('http://localhost:3001/reset-password/generate-reset-code', {
            email: email
        })
        .then((response) => {
            setInfoMessage('Dacă adresa de email este corectă, veți primi un cod de resetare pe care vă rugăm să-l introduceți în câmpul de mai jos.');
            setStepOne(false);
            setStepTwo(true);
        })
        .catch((error) => {
            alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    const validateResetCode = () => {
        axios.post('http://localhost:3001/reset-password/validate-reset-code', {
            email: email,
            reset_code: resetCode
        })
        .then((response) => {
            if(response.status === 200)
            {
                setStepTwo(false);
                setStepThree(true);
            }
        })
        .catch((error) => {
            if(error.response.status === 400)
            {
                setErrorMessage(error.response.data);
            }
            else
            {
                alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
            }
        });
    }

    const onSubmitPassword = () => {
        axios.put('http://localhost:3001/reset-password/reset-password', {
            email: email,
            password: passwordFormData.password
        })
        .then((response) => {
            if(response.status === 200)
            {
                setSuccesMessage('Parola a fost resetată cu succes');
            }
        })
        .catch((error) => {
            alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    const setCorrect = (id) => {
        if(stepThree && successMessage === '')
        {
            const text = document.querySelector(`#${id}`);
            text.style.color = 'green';
        }
    };

    const setIncorrect = (id) => {
        if(stepThree && successMessage === '')
        {
            const text = document.querySelector(`#${id}`);
            text.style.color = '#f52a2a';
        }
    };

    const checkPassword = () => {
        if(changed)
        {
            passwordFormData.password.trim().length < 8? setIncorrect('length') : setCorrect('length');

            (/[1-9]/g.test(passwordFormData.password.trim()))? setCorrect('digit') : setIncorrect('digit');

            (/[a-z]/g.test(passwordFormData.password.trim()))? setCorrect('lower-letter') : setIncorrect('lower-letter');
            
            (/[A-Z]/g.test(passwordFormData.password.trim()))? setCorrect('capital-letter') : setIncorrect('capital-letter');
            
            (/[.!?-]/g.test(passwordFormData.password.trim()))? setCorrect('special-char') : setIncorrect('special-char');
        }
    };

    useEffect(()=>{
        setChanged(true);
        checkPassword();
    },[passwordFormData.password]);

    return(
        <div className='reset-password'>
            <Grid container className='grid-container'>
                <Grid item>
                    <Paper className='paper'>
                        <Box className='box-title'>
                            <Typography className='typography-title' onClick={() => navigate('/')}>DAILY</Typography>
                        </Box>
                        {successMessage === '' && <Typography className='subtitle'>Resetare parolă</Typography>}
                        {
                            stepOne && (
                                <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
                                    <Grid container>
                                        <Typography sx={{fontSize: '16px', color: 'gray'}}>
                                            Vă rugăm să introduceți adresa de e-mail asociată contului dvs. pentru a primi codul de resetare a parolei.
                                        </Typography>
                                        <Grid item xs={12} py={2}>
                                            <TextField 
                                                {...registerEmail('email')} 
                                                name='email' 
                                                type='text' 
                                                label='Email'
                                                variant='outlined' 
                                                fullWidth 
                                                onChange={(event) => setEmail(event.target.value)}
                                            />
                                            <Typography className='error'>{emailErrors.email?.message}</Typography>
                                        </Grid>
                                        <Grid item xs={12} py={1}>
                                            <button type='submit' className='submit-button'>Trimite codul de resetare</button>
                                        </Grid>
                                    </Grid>
                                </form>
                            )
                        }
                        {
                            stepTwo && (
                                <Grid container>
                                    {infoMessage && <Alert severity='info' sx={{width: '100%'}}>Dacă adresa de e-mail este corectă, veți primi un cod de resetare pe care vă rugăm să-l introduceți în câmpul de mai jos.</Alert>}
                                    <Grid item xs={12} py={2}>
                                        <TextField 
                                            name='code' 
                                            type='text' 
                                            variant='outlined' 
                                            fullWidth 
                                            onChange={(event) => setResetCode(event.target.value)} 
                                            placeholder='Introduceți codul de resetare'
                                        />
                                    </Grid>
                                    {errorMessage &&  <Alert severity='error' sx={{width: '100%'}}>{errorMessage}</Alert>}
                                    <Grid item xs={12} py={1}>
                                        <button className='submit-button' onClick={() => validateResetCode()}>Validează codul introdus</button>
                                    </Grid>
                                </Grid> 
                            )
                        }
                        {
                            (stepThree && successMessage === '') && (
                                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                                    <Grid item xs={12} py={1}>
                                        <TextField 
                                            {...registerPassword('password')} 
                                            name='password' 
                                            label='Parola' 
                                            variant='outlined' 
                                            onChange={handleChangePassword} 
                                            fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>
                                                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                                                        {showPassword ? <VisibilityOff/> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} pt={1} pb={3}>
                                        <TextField 
                                            {...registerPassword('confirmPassword')} 
                                            name='confirmPassword' 
                                            label='Confirmă parola' 
                                            variant='outlined' 
                                            onChange={handleChangePassword} 
                                            fullWidth
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>
                                                    <IconButton onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                                                        {showConfirmPassword ? <VisibilityOff/> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }}
                                        />
                                        <Typography className='error'>{passwordErrors.confirmPassword?.message}</Typography>
                                    </Grid>
                                    <div className='password-requirements'>
                                        <p>Parola trebuie să conțină cel puțin: </p>
                                        <ul>
                                            <li id='length'>8 caractere</li>
                                            <li id='lower-letter'>o literă mică</li>
                                            <li id='capital-letter'>o literă mare</li>
                                            <li id='digit'>o cifră</li>
                                            <li id='special-char'>un caracter special -!.?</li>
                                        </ul>
                                    </div>
                                    <Grid item xs={12} py={1}>
                                        <button type='submit' className='submit-button'>Salvează noua parolă</button>
                                    </Grid>
                                </form>
                            )
                        } 
                        {successMessage &&  
                            (
                                <div className='success-div'>
                                    <span><VerifiedUser className='icon'/></span>
                                    <span className='success-message'>{successMessage}</span>
                                    <span className='link-message' onClick={() => navigate('/signin')}>Intră în cont</span>
                                </div>
                            )
                        }
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default ResetPassword;