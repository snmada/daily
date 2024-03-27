import React, {useState} from 'react';
import {Grid, Paper, Box, Typography, TextField, IconButton, InputAdornment} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import '../SignIn/SignIn.scss';

const initialState = {email: '', password: ''};

function SignIn() 
{
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialState);
    
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleChange = (event) => setFormData({...formData, [event.target.name]: event.target.value});

    const schema = yup.object().shape({
        email: yup.string().required('Câmp obligatoriu').email('Vă rugăm să folosiți o adresă de email validă'),
        password: yup.string().required('Câmp obligatoriu')
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async () => {
        console.log(formData);
    };

    return (
        <div className='signin'>
            <Grid container className='grid-container'>
                <Grid item>
                    <Paper className='paper'>
                        <Box className='box-title'>
                            <Typography className='typography-title' onClick={() => navigate('/')}>DAILY</Typography>
                        </Box>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('email')} 
                                        name='email' 
                                        type='text' 
                                        label='Email' 
                                        variant='outlined' 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                    <Typography className='error'>{errors.email?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('password')}
                                        name='password' 
                                        label='Parolă' 
                                        variant='outlined' 
                                        fullWidth 
                                        onChange={handleChange}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position='end'>
                                                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }}
                                    />
                                    <Typography className='error'>{errors.password?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={3}>
                                    <button type='submit' className='submit-button'>Intră în cont</button>
                                </Grid>
                                <Grid item xs={12} className='grid-signup'>
                                    <Typography fontSize={'15px'}>Nu aveți un cont creat?</Typography>
                                    <Typography className='signup-link' onClick={() => {navigate('/signup')}}>Creează acum</Typography>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default SignIn;