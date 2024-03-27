import React from 'react';
import {Grid, Typography, TextField, Box} from '@mui/material';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from 'react-router-dom';

function StepOne({formData, handleChange, handleNextStep}) 
{
    const navigate = useNavigate();

    const schema = yup.object().shape({
        firstname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        lastname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        CNP: yup.string().required('Câmp obligatoriu').min(13, 'CNP invalid').max(13, 'CNP invalid')
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = () => handleNextStep();

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container py={2}>
                <Grid item xs={12} py={1}>
                    <TextField 
                        {...register('lastname')} 
                        value={formData.lastname} 
                        name='lastname' 
                        type='text' 
                        label='Nume' 
                        variant='outlined' 
                        onChange={handleChange} 
                        fullWidth
                    />
                    <Typography className='error'>{errors.lastname?.message}</Typography>
                </Grid>
                <Grid item xs={12} py={1}>
                    <TextField 
                        {...register('firstname')} 
                        value={formData.firstname} 
                        name='firstname' 
                        type='text' 
                        label='Prenume' 
                        variant='outlined' 
                        onChange={handleChange} 
                        fullWidth
                    />
                    <Typography className='error'>{errors.firstname?.message}</Typography>
                </Grid>
                <Grid item xs={12} py={1}>
                    <TextField 
                        {...register('CNP')} 
                        value={formData.CNP} 
                        name='CNP' 
                        type='text' 
                        label='CNP (Cod Numeric Personal)' 
                        variant='outlined' 
                        onChange={handleChange} 
                        fullWidth
                    />
                    <Typography className='error'>{errors.CNP?.message}</Typography>
                </Grid>

                <Grid item xs={12} className='grid-signin'>
                    <Typography fontSize={'15px'}>Aveți un cont creat?</Typography>
                    <Typography className='signin-link' onClick={() => {navigate('/login')}}>Conectați-vă</Typography>
                </Grid>
                <Grid item xs={12} py={2}>
                    <Box className='box-next'>
                        <button type='submit' className='button-next'>Pasul următor</button>
                    </Box>
                </Grid>
            </Grid>   
        </form>
        </>
    );
}

export default StepOne;