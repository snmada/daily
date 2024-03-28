import React from 'react';
import {Grid} from '@mui/material';
import SideBar from '../../components/SideBar/SideBar.js';
import NavBar from '../../components/NavBar/NavBar.js';
import './Dashboard.scss';

function Dashboard()
{
    return(
        <Grid container className='dashboard'>
            <SideBar/>
            <Grid item className='main-content'>
                <NavBar title='Dashboard'/>
            </Grid>
        </Grid>
    );
}

export default Dashboard;