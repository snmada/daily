import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Grid, Typography, TextField, Box, IconButton, InputAdornment, Alert} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import YupPassword from 'yup-password';
import axios from 'axios';
YupPassword(yup)

function StepThree({formData, handleChange, handlePrevStep}) 
{
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [changed, setChanged] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => event.preventDefault();

    const schema = yup.object().shape({
        email: yup.string().required('Câmp obligatoriu').email('Adresă de email invalidă'),
        password: yup.string().password(),
        confirmPassword: yup.string().required('Câmp obligatoriu').oneOf([yup.ref('password'), null], 'Parolele introduse nu coincid')
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit =  () => {
        axios.post('http://localhost:3001/signup/stepThree', {
            email: formData.email,
            password: formData.password,
            CNP: formData.CNP
        })
        .then((response) => {
            if(response.status === 200)
            {
                sessionStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard');
            }
        })
        .catch((error) => {
            (error.response.status === 409)? 
                setErrorMessage(error.response.data) : alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    };

    const setCorrect = (id) => {
        const text = document.querySelector(`#${id}`);
        text.style.color = 'green';
    };

    const setIncorrect = (id) => {
        const text = document.querySelector(`#${id}`);
        text.style.color = '#f52a2a';
    };

    const checkPassword = () => {
        if(changed)
        {
            formData.password.trim().length < 8? setIncorrect('length') : setCorrect('length');

            (/[1-9]/g.test(formData.password.trim()))? setCorrect('digit') : setIncorrect('digit');

            (/[a-z]/g.test(formData.password.trim()))? setCorrect('lower-letter') : setIncorrect('lower-letter');
            
            (/[A-Z]/g.test(formData.password.trim()))? setCorrect('capital-letter') : setIncorrect('capital-letter');
            
            (/[.!?-]/g.test(formData.password.trim()))? setCorrect('special-char') : setIncorrect('special-char');
        }
    };

    useEffect(()=>{
        setChanged(true);
        checkPassword();
    },[formData.password]);

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
                <Grid item xs={12} py={1}>
                    <TextField 
                        {...register('email')} 
                        value={formData.email} 
                        name='email' 
                        type='text' 
                        label='Email' 
                        variant='outlined' 
                        onChange={handleChange} 
                        fullWidth
                    />
                    <Typography className='error'>{errors.email?.message}</Typography>
                </Grid>
                {errorMessage &&  <Alert severity='error' width={'100%'}>{errorMessage}</Alert>}
                <Grid item xs={12} py={1}>
                    <TextField 
                        {...register('password')} 
                        value={formData.password} 
                        name='password' 
                        label='Password' 
                        variant='outlined' 
                        onChange={handleChange} 
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12} pt={1} pb={3}>
                    <TextField 
                        {...register('confirmPassword')} 
                        value={formData.confirmPassword} 
                        name='confirmPassword' 
                        label='Confirm password' 
                        variant='outlined' 
                        onChange={handleChange} 
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    <Typography className='error'>{errors.confirmPassword?.message}</Typography>
                </Grid>
                <div className='password-requirements'>
                    <p>Password must have at least: </p>
                    <ul>
                        <li id='length'>8 characters</li>
                        <li id='lower-letter'>one lowercase character</li>
                        <li id='capital-letter'>one uppercase character</li>
                        <li id='digit'>one digit</li>
                        <li id='special-char'>one special character .!?-</li>
                    </ul>
                </div>
                <Grid item xs={6} py={2}>
                    <Box className='box-prev'>
                        <button onClick={handlePrevStep} className='button-prev'><NavigateBeforeIcon/></button>
                    </Box>
                </Grid>
                <Grid item xs={6} py={2}>
                    <Box className='box-next'>
                        <button type='submit' className='button-next'>Creare cont</button>
                    </Box>
                </Grid>
            </Grid>
        </form>
        </>
    );
}

export default StepThree;