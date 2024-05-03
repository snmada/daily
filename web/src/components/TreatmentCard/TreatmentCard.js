import React from 'react';
import './TreatmentCard.scss';
import {Grid, Typography, Box} from '@mui/material';

function TreatmentCard()
{
    return(
        <div className='div-treatment'>
            <Grid container className='container-treatment'>
                <Box className='title-box'>
                    <Typography className='title'>Tratament actual</Typography> 
                </Box>
                <Box className='diagnosis-box'>
                    <Typography className='diagnosis'>Afecțiune: ----</Typography>
                </Box> 
                <Box className='treatment-box'>
                    -----------
                </Box>
            </Grid>
        </div>
    );
}

export default TreatmentCard;