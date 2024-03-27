import React from 'react';
import {Grid, Typography, TextField, Box} from '@mui/material';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

function StepTwo({formData, handleChange, handleNextStep, handlePrevStep}) 
{
    const schema = yup.object().shape({
        stampCode: yup.string().required('Câmp obligatoriu').min(6, 'Cod invalid').max(6, 'Cod invalid').matches(/[0-9]+$/, 'Cod invalid')
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async () => {
        handleNextStep();
    };

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container py={2}>
                <Grid item xs={12} py={1}>
                    <TextField 
                        {...register('stampCode')} 
                        value={formData.stampCode} 
                        name='stampCode' 
                        type='text' 
                        label='Cod parafă' 
                        variant='outlined' 
                        onChange={handleChange} 
                        fullWidth
                    />
                    <Typography className='error'>{errors.stampCode?.message}</Typography>
                </Grid>

                <Grid item xs={12} pt={2} pb={7}>
                    <Typography className='note-description'>Notă: Vă rugăm să introduceți codul de parafă pentru a dovedi apartenența dumneavoastră la sistemul medical.</Typography>
                </Grid>
                <Grid item xs={6} py={2}>
                    <Box className='box-prev'>
                        <button onClick={handlePrevStep} className='button-prev'><NavigateBeforeIcon/></button>
                    </Box>
                </Grid>
                <Grid item xs={6} py={2}>
                    <Box className='box-next'>
                        <button type='submit' className='button-next'>Pasul următor</button>
                    </Box>
                </Grid>
            </Grid>
        </form>
        </>
    );
}

export default StepTwo;