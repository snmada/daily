import React from 'react';
import {Grid} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {MenuItems as sidebarItems} from '../MenuItems.js';
import './SideBar.scss';

function SideBar()
{
    const navigate = useNavigate();

    return(
        <Grid item className='sidebar' sx={{display: {xs: 'none', md: 'none', lg: 'block'}}}>
            <div className='sidebar-content'>
                <div className='logo'>DAILY</div>
                {sidebarItems.map((value, index) => (
                    <button className='button' id={window.location.pathname.match(value.route)? 'active' : ''} onClick={() => {navigate(value.route)}} key={index}>
                        <span className='icon'>{value.icon}</span>
                        <span>{value.name}</span>
                    </button>
                ))}
            </div>
        </Grid>
    );
}

export default SideBar;